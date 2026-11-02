import type { Thing } from "@/lib/structured-data";

interface JsonLdProps {
  data: Thing | Thing[];
}

export function JsonLd({ data }: JsonLdProps) {
  // Safely serialize and escape "<" as \u003c to prevent script injection vulnerabilities
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json">{serialized}</script>;
}
