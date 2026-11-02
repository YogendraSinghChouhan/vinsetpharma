import { randomUUID } from "node:crypto";
import zlib from "node:zlib";
import type { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BRAND_COLORS } from "@/config/site";

export const PRODUCT_IMAGE_DIMENSIONS = {
  width: 1200,
  height: 900,
} as const;

export const BLOG_IMAGE_DIMENSIONS = {
  width: 1600,
  height: 900,
} as const;

/**
 * Generates an S3 storage key conforming exactly to the application format:
 * `${purpose}/${uuid}.png`
 */
export function generateStorageKey(purpose: "products" | "blogs"): string {
  return `${purpose}/${randomUUID()}.png`;
}

/**
 * Fallback solid-color PNG generator using pure node:zlib without external dependencies.
 */
export function generateSolidPngFallback(
  width: number,
  height: number,
  r = 234,
  g = 243,
  b = 245,
): Buffer {
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf: Buffer): number {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 2; // RGB Truecolor
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk("IHDR", ihdr);
  const idatChunk = makeChunk("IDAT", deflated);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

/**
 * Builds an SVG using a soft tint of brand colors with the first letter of the item,
 * and a simple pharmaceutical pill or leaf motif (no text claims).
 */
export function buildPlaceholderSvg(options: {
  width: number;
  height: number;
  title: string;
  shapeType?: "pill" | "leaf";
}): string {
  const { width, height, title, shapeType = "pill" } = options;
  const firstLetter = title.trim().charAt(0).toUpperCase() || "V";
  const cx = Math.round(width / 2);
  const cy = Math.round(height / 2);

  const decorativeMotif =
    shapeType === "leaf"
      ? `
      <!-- Stylized leaf motif -->
      <g transform="translate(${cx - 30}, ${cy + 130})">
        <path d="M 0 30 C 0 0, 30 0, 60 0 C 60 30, 30 30, 0 30 Z" fill="${BRAND_COLORS.accent}" fill-opacity="0.7"/>
      </g>`
      : `
      <!-- Stylized pill capsule motif -->
      <g transform="translate(${cx - 50}, ${cy + 130})">
        <rect x="0" y="0" width="48" height="20" rx="10" fill="${BRAND_COLORS.primary}" fill-opacity="0.8"/>
        <rect x="52" y="0" width="48" height="20" rx="10" fill="${BRAND_COLORS.accent}" fill-opacity="0.8"/>
      </g>`;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eaf3f5"/>
      <stop offset="50%" stop-color="#f2f8f7"/>
      <stop offset="100%" stop-color="#edf6f3"/>
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="${BRAND_COLORS.primary}" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background with subtle tint of brand colors -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect x="16" y="16" width="${width - 32}" height="${height - 32}" fill="none" stroke="${BRAND_COLORS.accent}" stroke-opacity="0.25" stroke-width="2" rx="12"/>

  <!-- Center Card Emblem -->
  <g filter="url(#softShadow)">
    <circle cx="${cx}" cy="${cy}" r="170" fill="#ffffff" fill-opacity="0.95" stroke="${BRAND_COLORS.accent}" stroke-width="3"/>
  </g>

  <!-- First letter of the item -->
  <text x="${cx}" y="${cy + 8}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="140" font-weight="700" fill="${BRAND_COLORS.primary}" text-anchor="middle" dominant-baseline="central">
    ${firstLetter}
  </text>

  ${decorativeMotif}
</svg>`;
}

/**
 * Generates a placeholder PNG buffer.
 * If an external imageUrl is specified, it attempts to download and resize/crop to the target dimensions.
 * Otherwise (or if the network request fails), it generates a branded SVG converted to PNG via sharp,
 * or falls back to node:zlib solid-color PNG generation.
 */
export async function generatePlaceholderPng(options: {
  width: number;
  height: number;
  title: string;
  shapeType?: "pill" | "leaf";
  imageUrl?: string;
}): Promise<Buffer> {
  if (options.imageUrl) {
    try {
      const url = new URL(options.imageUrl);
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", String(options.width));
      url.searchParams.set("h", String(options.height));
      url.searchParams.set("q", "80");

      const response = await fetch(url.toString(), {
        headers: { "User-Agent": "VinsentPharmaSampleSeeder/1.0" },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        try {
          const sharpModule = await import("sharp");
          const sharp = sharpModule.default;
          return await sharp(buffer)
            .resize(options.width, options.height, { fit: "cover" })
            .png()
            .toBuffer();
        } catch {
          return buffer;
        }
      }
    } catch {
      // Gracefully fall through to generated SVG / fallback if network is unreachable
    }
  }

  try {
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default;
    const svgString = buildPlaceholderSvg(options);
    return await sharp(Buffer.from(svgString)).png().toBuffer();
  } catch {
    // If sharp is unavailable or fails, generate a solid-colour PNG with node:zlib
    return generateSolidPngFallback(options.width, options.height);
  }
}

/**
 * Uploads placeholder image to S3 bucket. Throws on error so seeding can abort cleanly.
 */
export async function uploadPlaceholderImage(
  s3: S3Client,
  bucket: string,
  key: string,
  buffer: Buffer,
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: "image/png",
  });

  await s3.send(command);
}
