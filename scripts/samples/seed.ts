import { mock } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";

// Cleanly mock server-only package so production modules can be imported by bun scripts
mock.module("server-only", () => ({}));

// Load environment configuration (.env.local, .env) before importing application config
loadEnvConfig(process.cwd());

const { env } = await import("@/config/env");

// SAFETY GUARD: Refuse to run unless host of env.APP_URL is localhost or 127.0.0.1
let appUrlHost = "";
try {
  appUrlHost = new URL(env.APP_URL).hostname;
} catch {
  console.error(
    "Refusing to run: Invalid APP_URL configured. Sample scripts are restricted to local development only.",
  );
  process.exit(1);
}

if (appUrlHost !== "localhost" && appUrlHost !== "127.0.0.1") {
  console.error(
    'Refusing to run: APP_URL must have a host of "localhost" or "127.0.0.1". Sample scripts are restricted to local development only.',
  );
  process.exit(1);
}

const { db } = await import("@/db/client");
const { categories } = await import("@/features/categories/schema");
const { products } = await import("@/features/products/schema");
const { posts } = await import("@/features/blogs/schema");
const { media } = await import("@/features/media/schema");
const { sanitizeContent } = await import("@/features/blogs/sanitize");
const { s3Client } = await import("@/features/storage/server/client");
const { deleteImage } = await import("@/features/storage/server/service");
const { PutObjectCommand } = await import("@aws-sdk/client-s3");
const { desc, eq } = await import("drizzle-orm");
const { MEDIA_MAX_ITEMS } = await import("@/features/media/constants");
const {
  SAMPLE_CATEGORIES,
  LEGACY_SAMPLE_CATEGORY_SLUGS,
  PRODUCT_TO_CATEGORY_SLUG,
  FEATURED_SAMPLE_PRODUCT_SLUGS,
  SAMPLE_PRODUCTS,
  SAMPLE_BLOG_POSTS,
  BLOG_POST_DISCLAIMER,
} = await import("./data");
const { SAMPLE_MEDIA_ITEMS } = await import("./media-data");
const {
  generatePlaceholderPng,
  generateStorageKey,
  uploadPlaceholderImage,
  PRODUCT_IMAGE_DIMENSIONS,
  BLOG_IMAGE_DIMENSIONS,
} = await import("./images");

// 1. SEED CATEGORIES (Idempotent: insert missing, update name if differed, preserve sortOrder and image)
const existingCategoryRows = await db
  .select({
    id: categories.id,
    slug: categories.slug,
    name: categories.name,
  })
  .from(categories);
const categoryMap = new Map<string, string>(
  existingCategoryRows.map((c) => [c.slug, c.id]),
);
const categoryNameMap = new Map<string, string>(
  existingCategoryRows.map((c) => [c.slug, c.name]),
);

let categoriesCreated = 0;
let categoriesRenamed = 0;
let categoriesUnchanged = 0;

const [maxCategorySortRow] = await db
  .select({ sortOrder: categories.sortOrder })
  .from(categories)
  .orderBy(desc(categories.sortOrder))
  .limit(1);

let currentCategorySortOrder = maxCategorySortRow?.sortOrder ?? 0;

for (const sampleCategory of SAMPLE_CATEGORIES) {
  const existingId = categoryMap.get(sampleCategory.slug);
  if (existingId) {
    const existingName = categoryNameMap.get(sampleCategory.slug);
    if (existingName !== sampleCategory.name) {
      await db
        .update(categories)
        .set({ name: sampleCategory.name })
        .where(eq(categories.id, existingId));
      categoriesRenamed++;
    } else {
      categoriesUnchanged++;
    }
    continue;
  }

  currentCategorySortOrder += 1;

  // imageKey left null on purpose so the fallback gets exercised
  const [created] = await db
    .insert(categories)
    .values({
      name: sampleCategory.name,
      slug: sampleCategory.slug,
      imageKey: null,
      sortOrder: currentCategorySortOrder,
    })
    .returning({ id: categories.id });

  if (created) {
    categoryMap.set(sampleCategory.slug, created.id);
    categoriesCreated++;
  }
}

// 2. SEED PRODUCTS (Idempotent: insert missing, reassign categoryId by map if null or different)
const existingProductRows = await db
  .select({
    id: products.id,
    slug: products.slug,
    categoryId: products.categoryId,
  })
  .from(products);
const existingProductsBySlug = new Map(
  existingProductRows.map((p) => [p.slug, p]),
);

let productsCreated = 0;
let productsAssigned = 0;
let productsSkipped = 0;

// Query current maximum sortOrder so new items continue sequentially
const [maxSortRow] = await db
  .select({ sortOrder: products.sortOrder })
  .from(products)
  .orderBy(desc(products.sortOrder))
  .limit(1);

let currentSortOrder = maxSortRow?.sortOrder ?? 0;

for (const sampleProduct of SAMPLE_PRODUCTS) {
  const targetCategorySlug = PRODUCT_TO_CATEGORY_SLUG[sampleProduct.slug];
  const targetCategoryId = targetCategorySlug
    ? (categoryMap.get(targetCategorySlug) ?? null)
    : null;

  const existing = existingProductsBySlug.get(sampleProduct.slug);
  if (existing) {
    // If product already exists with a null or different category, link to target category
    if (targetCategoryId && existing.categoryId !== targetCategoryId) {
      await db
        .update(products)
        .set({ categoryId: targetCategoryId })
        .where(eq(products.id, existing.id));
      productsAssigned++;
    } else {
      productsSkipped++;
    }
    continue;
  }

  currentSortOrder += 1;

  // Generate placeholder image (downloads curated photo or generates SVG fallback)
  const imageBuffer = await generatePlaceholderPng({
    width: PRODUCT_IMAGE_DIMENSIONS.width,
    height: PRODUCT_IMAGE_DIMENSIONS.height,
    title: sampleProduct.title,
    shapeType: "pill",
    imageUrl: sampleProduct.imageUrl,
  });

  // Upload placeholder image to S3; fail immediately if upload fails
  const imageKey = generateStorageKey("products");
  try {
    await uploadPlaceholderImage(
      s3Client,
      env.S3_BUCKET,
      imageKey,
      imageBuffer,
    );
  } catch (err: unknown) {
    console.error(
      `Failed to upload product image for "${sampleProduct.slug}". Aborting seed. No database row was inserted.`,
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }

  // Insert product directly via Drizzle
  const isFeatured = FEATURED_SAMPLE_PRODUCT_SLUGS.includes(sampleProduct.slug);
  await db.insert(products).values({
    title: sampleProduct.title,
    slug: sampleProduct.slug,
    tagline: sampleProduct.tagline,
    description: sampleProduct.description,
    imageKey,
    categoryId: targetCategoryId,
    sortOrder: currentSortOrder,
    published: true,
    featured: isFeatured,
  });

  productsCreated++;
}

// 2b. SET FEATURED STATUS ON SAMPLE PRODUCTS (Idempotent, strictly touches sample product slugs only)
for (const sampleProduct of SAMPLE_PRODUCTS) {
  const shouldBeFeatured = FEATURED_SAMPLE_PRODUCT_SLUGS.includes(
    sampleProduct.slug,
  );
  await db
    .update(products)
    .set({ featured: shouldBeFeatured })
    .where(eq(products.slug, sampleProduct.slug));
}

// 3. SEED BLOG POSTS (Idempotent: skip existing slugs)
const existingPostRows = await db.select({ slug: posts.slug }).from(posts);
const existingPostSlugs = new Set(existingPostRows.map((p) => p.slug));

let postsCreated = 0;
let postsSkipped = 0;

const now = new Date();

for (let i = 0; i < SAMPLE_BLOG_POSTS.length; i++) {
  const samplePost = SAMPLE_BLOG_POSTS[i];
  if (existingPostSlugs.has(samplePost.slug)) {
    postsSkipped++;
    continue;
  }

  // Stagger publishedAt one every 4 days going back from today
  const publishedDate = new Date(now.getTime() - i * 4 * 24 * 60 * 60 * 1000);

  // Append disclaimer and sanitize HTML content
  const fullContent = `${samplePost.content}${BLOG_POST_DISCLAIMER}`;
  const sanitizedContent = sanitizeContent(fullContent);

  // Generate placeholder cover image (downloads curated photo or generates SVG fallback)
  const imageBuffer = await generatePlaceholderPng({
    width: BLOG_IMAGE_DIMENSIONS.width,
    height: BLOG_IMAGE_DIMENSIONS.height,
    title: samplePost.title,
    shapeType: "leaf",
    imageUrl: samplePost.imageUrl,
  });

  // Upload cover image to S3; fail immediately if upload fails
  const coverImageKey = generateStorageKey("blogs");
  try {
    await uploadPlaceholderImage(
      s3Client,
      env.S3_BUCKET,
      coverImageKey,
      imageBuffer,
    );
  } catch (err: unknown) {
    console.error(
      `Failed to upload blog cover image for "${samplePost.slug}". Aborting seed. No database row was inserted.`,
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }

  // Insert post directly via Drizzle
  await db.insert(posts).values({
    title: samplePost.title,
    slug: samplePost.slug,
    content: sanitizedContent,
    coverImageKey,
    seoTitle: samplePost.seoTitle,
    seoDescription: samplePost.seoDescription,
    published: true,
    publishedAt: publishedDate,
    createdAt: publishedDate,
    updatedAt: publishedDate,
  });

  postsCreated++;
}

// 4. CLEAN UP LEGACY SAMPLE CATEGORIES (Only delete legacy category if NO product references it)
let legacyCategoriesRemoved = 0;

for (const legacySlug of LEGACY_SAMPLE_CATEGORY_SLUGS) {
  const [legacyCategory] = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      imageKey: categories.imageKey,
    })
    .from(categories)
    .where(eq(categories.slug, legacySlug))
    .limit(1);

  if (!legacyCategory) {
    continue;
  }

  const [referencingProduct] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.categoryId, legacyCategory.id))
    .limit(1);

  if (!referencingProduct) {
    await db.delete(categories).where(eq(categories.id, legacyCategory.id));
    legacyCategoriesRemoved++;

    if (legacyCategory.imageKey) {
      try {
        await deleteImage(legacyCategory.imageKey);
      } catch {
        // Ignore missing objects from S3
      }
    }
  }
}

// 5. SEED MEDIA (Idempotent: skip existing fileKey, respect MEDIA_MAX_ITEMS limit)
const existingMediaRows = await db
  .select({
    id: media.id,
    fileKey: media.fileKey,
  })
  .from(media);

const existingMediaFileKeys = new Set(existingMediaRows.map((m) => m.fileKey));
let totalMediaCount = existingMediaRows.length;

const [maxMediaSortRow] = await db
  .select({ sortOrder: media.sortOrder })
  .from(media)
  .orderBy(desc(media.sortOrder))
  .limit(1);

let currentMediaSortOrder = maxMediaSortRow?.sortOrder ?? 0;
let mediaSeeded = 0;
let mediaSkipped = 0;
let mediaMissing = 0;

const sharpModule = await import("sharp");
const sharp = sharpModule.default;

for (const sampleItem of SAMPLE_MEDIA_ITEMS) {
  if (existingMediaFileKeys.has(sampleItem.key)) {
    mediaSkipped++;
    continue;
  }

  const localPath = path.join(
    process.cwd(),
    "scripts",
    "samples",
    "media",
    sampleItem.file,
  );

  if (!fs.existsSync(localPath)) {
    console.warn(`Sample media file missing on disk: ${sampleItem.file}`);
    mediaMissing++;
    continue;
  }

  if (totalMediaCount >= MEDIA_MAX_ITEMS) {
    console.warn(
      `Media item limit (${MEDIA_MAX_ITEMS}) reached. Halting sample media seed.`,
    );
    break;
  }

  const buffer = fs.readFileSync(localPath);
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 900;

  const ext = sampleItem.file.split(".").pop()?.toLowerCase();
  const contentType =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: sampleItem.key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
  } catch (err: unknown) {
    console.error(
      `Failed to upload sample media "${sampleItem.key}". Aborting seed. No database row was inserted.`,
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  }

  currentMediaSortOrder += 1;
  totalMediaCount += 1;

  await db.insert(media).values({
    type: "image",
    fileKey: sampleItem.key,
    posterKey: null,
    width,
    height,
    durationSeconds: null,
    caption: sampleItem.caption,
    sortOrder: currentMediaSortOrder,
  });

  existingMediaFileKeys.add(sampleItem.key);
  mediaSeeded++;
}

// 6. Short summary of counts (never log secrets, env values or connection strings)
console.info("Sample seed completed:");
console.info(
  `- Categories: ${categoriesCreated} created, ${categoriesRenamed} renamed, ${categoriesUnchanged} unchanged, ${legacyCategoriesRemoved} legacy removed`,
);
console.info(
  `- Products: ${productsCreated} created, ${productsAssigned} assigned, ${productsSkipped} unchanged`,
);
console.info(`- Blog posts: ${postsCreated} created, ${postsSkipped} skipped`);
console.info(
  `- Media: ${mediaSeeded} seeded, ${mediaSkipped} skipped, ${mediaMissing} missing`,
);
console.info(
  "Reminder: Cached public pages may be stale until the dev server restarts or something is saved once in the admin.",
);
