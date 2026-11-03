import { createHash } from "node:crypto";

export interface SampleMediaItem {
  index: number;
  file: string;
  caption: string | null;
  key: string;
}

/**
 * Derives a deterministic UUID and storage key for a sample media item.
 * Uses sha1("vinsent-sample-media-<index>") formatted as 8-4-4-4-12 hex.
 * Valid under the media key regex `^media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|mp4|webm)$`.
 */
export function getSampleMediaStorageKey(index: number, ext = "jpg"): string {
  const hash = createHash("sha1")
    .update(`vinsent-sample-media-${index}`)
    .digest("hex");
  const uuid = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
  return `media/${uuid}.${ext}`;
}

export const SAMPLE_MEDIA_ENTRIES: Array<{
  file: string;
  caption: string | null;
}> = [
  // 12 Landscape
  {
    file: "sample-01-blister-packs.jpg",
    caption: "Sealed medication blister packages on neutral surface",
  },
  {
    file: "sample-02-laboratory-beakers.jpg",
    caption: "Three graduated glass beakers in a laboratory",
  },
  {
    file: "sample-03-capsule-assortment.jpg",
    caption: null,
  },
  {
    file: "sample-04-pharmacy-shelving.jpg",
    caption: "Uniform amber medicine bottles on pharmacy shelving",
  },
  {
    file: "sample-05-blister-tablets.jpg",
    caption: "Foil blister packaging containing pharmaceutical tablets",
  },
  {
    file: "sample-06-test-tubes-rack.jpg",
    caption: null,
  },
  {
    file: "sample-07-glass-pipette-macro.jpg",
    caption: "Glass pipette dispensing a liquid drop",
  },
  {
    file: "sample-08-amber-dropper-bottles.jpg",
    caption: "Amber glass bottles with precision dropper caps",
  },
  {
    file: "sample-09-mortar-pestle-herbs.jpg",
    caption: null,
  },
  {
    file: "sample-10-botanical-preparation.jpg",
    caption: "Dried botanical ingredients in ceramic mortar",
  },
  {
    file: "sample-11-laboratory-dropper-glassware.jpg",
    caption: "Clean laboratory glassware with measuring dropper",
  },
  {
    file: "sample-12-test-tubes-blue.jpg",
    caption: "Glass test tubes arranged in clean rack",
  },

  // 4 Portrait
  {
    file: "sample-13-foil-blister-portrait.jpg",
    caption: null,
  },
  {
    file: "sample-14-laboratory-notebook-desk.jpg",
    caption: "Laboratory notebook on a clean reflective desk",
  },
  {
    file: "sample-15-white-tablets-composition.jpg",
    caption: "White pharmaceutical tablets on light surface",
  },
  {
    file: "sample-16-capsules-teal-white.jpg",
    caption: null,
  },

  // 4 Square
  {
    file: "sample-17-measuring-tubes-pile.jpg",
    caption: "Clean glass measuring tubes in laboratory",
  },
  {
    file: "sample-18-tablets-blister-packs-square.jpg",
    caption: null,
  },
  {
    file: "sample-19-laboratory-bottles-square.jpg",
    caption: "Glass reagent bottles on laboratory shelving",
  },
  {
    file: "sample-20-capsule-macro-square.jpg",
    caption: "Pharmaceutical capsule lot in close-up presentation",
  },
];

export const SAMPLE_MEDIA_ITEMS: SampleMediaItem[] = SAMPLE_MEDIA_ENTRIES.map(
  (entry, idx) => {
    const index = idx + 1;
    const ext = entry.file.split(".").pop()?.toLowerCase() || "jpg";
    return {
      index,
      file: entry.file,
      caption: entry.caption,
      key: getSampleMediaStorageKey(index, ext),
    };
  },
);

export const ALL_SAMPLE_MEDIA_KEYS = SAMPLE_MEDIA_ITEMS.map((item) => item.key);
