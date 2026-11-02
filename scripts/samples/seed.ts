import { mock } from "bun:test";
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
const { products } = await import("@/features/products/schema");
const { posts } = await import("@/features/blogs/schema");
const { sanitizeContent } = await import("@/features/blogs/sanitize");
const { s3Client } = await import("@/features/storage/server/client");
const { desc } = await import("drizzle-orm");
const { SAMPLE_PRODUCTS, SAMPLE_BLOG_POSTS, BLOG_POST_DISCLAIMER } =
  await import("./data");
const {
  generatePlaceholderPng,
  generateStorageKey,
  uploadPlaceholderImage,
  PRODUCT_IMAGE_DIMENSIONS,
  BLOG_IMAGE_DIMENSIONS,
} = await import("./images");

// 1. SEED PRODUCTS (Idempotent: skip existing slugs)
const existingProductRows = await db
  .select({ slug: products.slug })
  .from(products);
const existingProductSlugs = new Set(existingProductRows.map((p) => p.slug));

let productsCreated = 0;
let productsSkipped = 0;

// Query current maximum sortOrder so new items continue sequentially
const [maxSortRow] = await db
  .select({ sortOrder: products.sortOrder })
  .from(products)
  .orderBy(desc(products.sortOrder))
  .limit(1);

let currentSortOrder = maxSortRow?.sortOrder ?? 0;

for (const sampleProduct of SAMPLE_PRODUCTS) {
  if (existingProductSlugs.has(sampleProduct.slug)) {
    productsSkipped++;
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
  await db.insert(products).values({
    title: sampleProduct.title,
    slug: sampleProduct.slug,
    tagline: sampleProduct.tagline,
    description: sampleProduct.description,
    imageKey,
    sortOrder: currentSortOrder,
    published: true,
  });

  productsCreated++;
}

// 2. SEED BLOG POSTS (Idempotent: skip existing slugs)
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

// 3. Short summary of counts (never log secrets, env values or connection strings)
console.info("Sample seed completed:");
console.info(
  `- Products: ${productsCreated} created, ${productsSkipped} skipped`,
);
console.info(`- Blog posts: ${postsCreated} created, ${postsSkipped} skipped`);
console.info(
  "Reminder: Cached public pages may be stale until the dev server restarts or a product/post is saved once in the admin.",
);
