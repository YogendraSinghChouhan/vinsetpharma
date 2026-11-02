import { env } from "@/config/env";

/**
 * Builds the public URL for an S3 image object key.
 * Can be safely called in server components (using S3_PUBLIC_URL) or in client components
 * (using NEXT_PUBLIC_S3_PUBLIC_URL or an optional passed-in baseUrl).
 */
export function getImageUrl(key: string, baseUrl?: string): string {
  const base =
    baseUrl ||
    (typeof window === "undefined"
      ? env.S3_PUBLIC_URL
      : env.NEXT_PUBLIC_S3_PUBLIC_URL);

  if (!base) {
    throw new Error(
      "Missing public S3 URL: neither S3_PUBLIC_URL nor NEXT_PUBLIC_S3_PUBLIC_URL is configured.",
    );
  }

  const cleanBase = base.replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${cleanBase}/${cleanKey}`;
}
