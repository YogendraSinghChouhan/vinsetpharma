import "server-only";

import { count, desc, sql } from "drizzle-orm";
import { env } from "@/config/env";
import { db } from "@/db/client";
import { requireAdmin } from "@/features/auth/data";
import { posts } from "@/features/blogs/schema";
import { products } from "@/features/products/schema";
import { type QuoteStatus, quoteRequests } from "@/features/quotes/schema";

export type AdminDashboardStats = {
  quotes: {
    total: number;
    new: number;
    contacted: number;
    last7Days: number;
  };
  products: {
    total: number;
    published: number;
    draft: number;
  };
  blogs: {
    total: number;
    published: number;
    draft: number;
  };
};

export type DashboardRecentQuote = {
  id: string;
  productTitle: string;
  name: string;
  email: string;
  phone: string;
  status: QuoteStatus;
  emailSentAt: Date | null;
  createdAt: Date;
};

export type DashboardRecentProduct = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  imageKey: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
};

export type DashboardRecentPost = {
  id: string;
  title: string;
  slug: string;
  coverImageKey: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
};

export type DashboardSystemInfo = {
  nodeEnv: string;
  storageBucket: string;
  storageRegion: string;
  notificationEmail: string;
};

export type AdminDashboardData = {
  stats: AdminDashboardStats;
  recentQuotes: DashboardRecentQuote[];
  recentProducts: DashboardRecentProduct[];
  recentPosts: DashboardRecentPost[];
  system: DashboardSystemInfo;
};

/**
 * Aggregates all dashboard metrics, recent inquiries, catalog items, and editorial articles
 * in a single parallel query set. Protected by requireAdmin().
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  await requireAdmin();

  const [
    [quoteCounts],
    [productCounts],
    [postCounts],
    recentQuotes,
    recentProducts,
    recentPosts,
  ] = await Promise.all([
    db
      .select({
        total: count(),
        newCount: sql<number>`count(*) filter (where ${quoteRequests.status} = 'new')`,
        contactedCount: sql<number>`count(*) filter (where ${quoteRequests.status} = 'contacted')`,
        last7DaysCount: sql<number>`count(*) filter (where ${quoteRequests.createdAt} >= NOW() - INTERVAL '7 days')`,
      })
      .from(quoteRequests),
    db
      .select({
        total: count(),
        publishedCount: sql<number>`count(*) filter (where ${products.published} = true)`,
        draftCount: sql<number>`count(*) filter (where ${products.published} = false)`,
      })
      .from(products),
    db
      .select({
        total: count(),
        publishedCount: sql<number>`count(*) filter (where ${posts.published} = true)`,
        draftCount: sql<number>`count(*) filter (where ${posts.published} = false)`,
      })
      .from(posts),
    db
      .select({
        id: quoteRequests.id,
        productTitle: quoteRequests.productTitle,
        name: quoteRequests.name,
        email: quoteRequests.email,
        phone: quoteRequests.phone,
        status: quoteRequests.status,
        emailSentAt: quoteRequests.emailSentAt,
        createdAt: quoteRequests.createdAt,
      })
      .from(quoteRequests)
      .orderBy(desc(quoteRequests.createdAt))
      .limit(6),
    db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        tagline: products.tagline,
        imageKey: products.imageKey,
        published: products.published,
        sortOrder: products.sortOrder,
        createdAt: products.createdAt,
      })
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(5),
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        coverImageKey: posts.coverImageKey,
        published: posts.published,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(5),
  ]);

  return {
    stats: {
      quotes: {
        total: Number(quoteCounts?.total ?? 0),
        new: Number(quoteCounts?.newCount ?? 0),
        contacted: Number(quoteCounts?.contactedCount ?? 0),
        last7Days: Number(quoteCounts?.last7DaysCount ?? 0),
      },
      products: {
        total: Number(productCounts?.total ?? 0),
        published: Number(productCounts?.publishedCount ?? 0),
        draft: Number(productCounts?.draftCount ?? 0),
      },
      blogs: {
        total: Number(postCounts?.total ?? 0),
        published: Number(postCounts?.publishedCount ?? 0),
        draft: Number(postCounts?.draftCount ?? 0),
      },
    },
    recentQuotes,
    recentProducts,
    recentPosts,
    system: {
      nodeEnv: process.env.NODE_ENV ?? "development",
      storageBucket: env.S3_BUCKET,
      storageRegion: env.S3_REGION,
      notificationEmail: env.QUOTE_NOTIFICATION_EMAIL,
    },
  };
}
