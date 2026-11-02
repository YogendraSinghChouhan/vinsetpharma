import type { NextConfig } from "next";
import { env } from "./src/config/env";

function getS3RemotePatterns(): NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> {
  const patterns: NonNullable<
    NonNullable<NextConfig["images"]>["remotePatterns"]
  > = [
    // Static wildcards for Neon Cloud Storage
    {
      protocol: "https",
      hostname: "**.neon.tech",
    },
    {
      protocol: "https",
      hostname: "**.aws.neon.tech",
    },
  ];

  const candidateUrls: string[] = [];

  try {
    if (env.S3_PUBLIC_URL) candidateUrls.push(env.S3_PUBLIC_URL);
  } catch {
    // env schema validation may not be ready in all phases
  }

  try {
    if (env.NEXT_PUBLIC_S3_PUBLIC_URL) {
      candidateUrls.push(env.NEXT_PUBLIC_S3_PUBLIC_URL);
    }
  } catch {
    // env schema validation may not be ready in all phases
  }

  if (process.env.S3_PUBLIC_URL) candidateUrls.push(process.env.S3_PUBLIC_URL);
  if (process.env.NEXT_PUBLIC_S3_PUBLIC_URL) {
    candidateUrls.push(process.env.NEXT_PUBLIC_S3_PUBLIC_URL);
  }
  if (process.env.S3_ENDPOINT) candidateUrls.push(process.env.S3_ENDPOINT);

  const seenHostnames = new Set<string>();

  for (const candidate of candidateUrls) {
    try {
      const parsed = new URL(candidate);
      const protocol = parsed.protocol.replace(":", "") as "http" | "https";
      if (!seenHostnames.has(parsed.hostname)) {
        seenHostnames.add(parsed.hostname);
        patterns.push({
          protocol,
          hostname: parsed.hostname,
        });
      }
    } catch {
      // Ignore invalid candidate URLs
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: false,
  reactCompiler: true,
  images: {
    remotePatterns: getS3RemotePatterns(),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none'",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
