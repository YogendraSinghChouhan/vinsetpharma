import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { ROUTES } from "@/config/site";
import { getPublishedPostsForSitemap } from "@/features/blogs/public-data";
import { getPublishedProductsForSitemap } from "@/features/products/public-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.APP_URL.replace(/\/+$/, "");

  // Static public marketing and catalog routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}${ROUTES.home}`,
    },
    {
      url: `${baseUrl}${ROUTES.aboutUs}`,
    },
    {
      url: `${baseUrl}${ROUTES.whyUs}`,
    },
    {
      url: `${baseUrl}${ROUTES.contactUs}`,
    },
    {
      url: `${baseUrl}${ROUTES.products}`,
    },
    {
      url: `${baseUrl}${ROUTES.blog}`,
    },
  ];

  // Published products
  const products = await getPublishedProductsForSitemap();
  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.slug && p.slug !== "__placeholder__")
    .map((p) => ({
      url: `${baseUrl}${ROUTES.productDetail(p.slug)}`,
      lastModified: p.updatedAt,
    }));

  // Published blog posts
  const posts = await getPublishedPostsForSitemap();
  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug && p.slug !== "__placeholder__")
    .map((p) => ({
      url: `${baseUrl}${ROUTES.blogDetail(p.slug)}`,
      lastModified: p.updatedAt,
    }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
