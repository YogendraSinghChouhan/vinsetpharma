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
const { deleteImage } = await import("@/features/storage/server/service");
const { inArray } = await import("drizzle-orm");
const { SAMPLE_PRODUCTS, SAMPLE_BLOG_POSTS } = await import("./data");

const sampleProductSlugs = SAMPLE_PRODUCTS.map((p) => p.slug);
const samplePostSlugs = SAMPLE_BLOG_POSTS.map((p) => p.slug);

let productsRemoved = 0;
let postsRemoved = 0;
let imagesDeleted = 0;

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

// 3. Short summary of counts (never log secrets, env values or connection strings)
console.info("Sample cleanup completed:");
console.info(`- Products removed: ${productsRemoved}`);
console.info(`- Blog posts removed: ${postsRemoved}`);
console.info(`- Images deleted: ${imagesDeleted}`);
