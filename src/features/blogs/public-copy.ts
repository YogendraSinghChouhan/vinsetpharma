import type { PublicPost } from "./public-data";

const UNSUITABLE_PUBLIC_COPY = [
  /\bGMP\b/,
  /\bWHO\b/,
  /\bISO\b/,
  /certified/i,
  /\b(best|leading|world-class|trusted by|pan-India|nationwide|worldwide|guarantee[sd]?)\b/i,
  /\b\d+\+?\s*years\b/i,
];

export function isSuitableForPublicCopy(post: PublicPost): boolean {
  const copy = [post.title, post.content, post.seoTitle, post.seoDescription]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  return !UNSUITABLE_PUBLIC_COPY.some((pattern) => pattern.test(copy));
}
