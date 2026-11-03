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
const { categories } = await import("@/features/categories/schema");
const { products } = await import("@/features/products/schema");
const { posts } = await import("@/features/blogs/schema");
const { media } = await import("@/features/media/schema");
const { heroSlides } = await import("@/features/hero/schema");
const { deleteImage } = await import("@/features/storage/server/service");
const { eq, inArray } = await import("drizzle-orm");
const {
  SAMPLE_CATEGORIES,
  LEGACY_SAMPLE_CATEGORY_SLUGS,
  SAMPLE_PRODUCTS,
  SAMPLE_BLOG_POSTS,
} = await import("./data");
const { ALL_SAMPLE_MEDIA_KEYS } = await import("./media-data");
const { ALL_SAMPLE_HERO_KEYS } = await import("./hero-data");

const sampleProductSlugs = SAMPLE_PRODUCTS.map((p) => p.slug);
const samplePostSlugs = SAMPLE_BLOG_POSTS.map((p) => p.slug);
const candidateCategorySlugs = Array.from(
  new Set([
    ...SAMPLE_CATEGORIES.map((c) => c.slug),
    ...LEGACY_SAMPLE_CATEGORY_SLUGS,
  ]),
);

let productsRemoved = 0;
let postsRemoved = 0;
let categoriesRemoved = 0;
let mediaRemoved = 0;
let heroSlidesRemoved = 0;
let imagesDeleted = 0;
let mediaFilesDeleted = 0;
let heroFilesDeleted = 0;

// 1. REMOVE SAMPLE PRODUCTS
const existingProducts = await db
  .select({
    id: products.id,
    slug: products.slug,
    imageKey: products.imageKey,
  })
  .from(products)
  .where(inArray(products.slug, sampleProductSlugs));

if (existingProducts.length > 0) {
  const slugsToDelete = existingProducts.map((p) => p.slug);

  // Delete matching rows from database
  await db.delete(products).where(inArray(products.slug, slugsToDelete));
  productsRemoved = existingProducts.length;

  // Delete associated images from storage (ignoring missing objects)
  for (const product of existingProducts) {
    try {
      await deleteImage(product.imageKey);
      imagesDeleted++;
    } catch {
      // Ignore missing objects from S3
    }
  }
}

// 2. REMOVE SAMPLE BLOG POSTS
const existingPosts = await db
  .select({
    id: posts.id,
    slug: posts.slug,
    coverImageKey: posts.coverImageKey,
  })
  .from(posts)
  .where(inArray(posts.slug, samplePostSlugs));

if (existingPosts.length > 0) {
  const slugsToDelete = existingPosts.map((p) => p.slug);

  // Delete matching rows from database
  await db.delete(posts).where(inArray(posts.slug, slugsToDelete));
  postsRemoved = existingPosts.length;

  // Delete associated images from storage (ignoring missing objects)
  for (const post of existingPosts) {
    try {
      await deleteImage(post.coverImageKey);
      imagesDeleted++;
    } catch {
      // Ignore missing objects from S3
    }
  }
}

// 3. REMOVE SAMPLE CATEGORIES (Only those with no remaining referencing products)
const existingCategories = await db
  .select({
    id: categories.id,
    slug: categories.slug,
    name: categories.name,
    imageKey: categories.imageKey,
  })
  .from(categories)
  .where(inArray(categories.slug, candidateCategorySlugs));

const keptCategories: Array<{
  name: string;
  slug: string;
  referencingCount: number;
}> = [];

for (const category of existingCategories) {
  const referencingProducts = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.categoryId, category.id));

  if (referencingProducts.length === 0) {
    await db.delete(categories).where(eq(categories.id, category.id));
    categoriesRemoved++;

    if (category.imageKey) {
      try {
        await deleteImage(category.imageKey);
        imagesDeleted++;
      } catch {
        // Ignore missing objects from S3
      }
    }
  } else {
    keptCategories.push({
      name: category.name,
      slug: category.slug,
      referencingCount: referencingProducts.length,
    });
  }
}

// 4. REMOVE SAMPLE MEDIA (strictly matches the 20 derived sample media keys)
const existingSampleMedia = await db
  .select({
    id: media.id,
    fileKey: media.fileKey,
    posterKey: media.posterKey,
  })
  .from(media)
  .where(inArray(media.fileKey, ALL_SAMPLE_MEDIA_KEYS));

if (existingSampleMedia.length > 0) {
  await db.delete(media).where(inArray(media.fileKey, ALL_SAMPLE_MEDIA_KEYS));
  mediaRemoved = existingSampleMedia.length;

  for (const item of existingSampleMedia) {
    try {
      await deleteImage(item.fileKey);
      mediaFilesDeleted++;
    } catch {
      // Ignore missing objects from S3
    }
    if (item.posterKey) {
      try {
        await deleteImage(item.posterKey);
        mediaFilesDeleted++;
      } catch {
        // Ignore missing objects from S3
      }
    }
  }
}

// 5. REMOVE SAMPLE HERO SLIDES (strictly matches the derived sample hero keys)
const existingSampleHero = await db
  .select({
    id: heroSlides.id,
    imageKey: heroSlides.imageKey,
  })
  .from(heroSlides)
  .where(inArray(heroSlides.imageKey, ALL_SAMPLE_HERO_KEYS));

if (existingSampleHero.length > 0) {
  await db
    .delete(heroSlides)
    .where(inArray(heroSlides.imageKey, ALL_SAMPLE_HERO_KEYS));
  heroSlidesRemoved = existingSampleHero.length;

  for (const item of existingSampleHero) {
    try {
      await deleteImage(item.imageKey);
      heroFilesDeleted++;
    } catch {
      // Ignore missing objects from S3
    }
  }
}

// 6. Short summary of counts (never log secrets, env values or connection strings)
console.info("Sample cleanup completed:");
console.info(`- Products removed: ${productsRemoved}`);
console.info(`- Blog posts removed: ${postsRemoved}`);
console.info(`- Categories removed: ${categoriesRemoved}`);
console.info(
  `- Media removed: ${mediaRemoved} (${mediaFilesDeleted} files deleted)`,
);
console.info(
  `- Hero slides removed: ${heroSlidesRemoved} (${heroFilesDeleted} files deleted)`,
);
if (keptCategories.length > 0) {
  console.info(
    `- Categories kept (${keptCategories.length}) because real products still reference them:`,
  );
  for (const kept of keptCategories) {
    console.info(
      `  * "${kept.name}" (${kept.slug}): referenced by ${kept.referencingCount} product(s)`,
    );
  }
}
console.info(`- Images deleted: ${imagesDeleted}`);
