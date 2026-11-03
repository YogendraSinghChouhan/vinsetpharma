import { NextResponse } from "next/server";
import { z } from "zod";
import { searchPublicContent } from "@/features/search/data";

const searchQuerySchema = z.object({
  q: z.string().trim().min(2).max(100),
});

export async function GET(request: Request) {
  const query = searchQuerySchema.safeParse({
    q: new URL(request.url).searchParams.get("q") ?? "",
  });

  if (!query.success) {
    return NextResponse.json(
      { error: "Search query must contain between 2 and 100 characters." },
      { status: 400 },
    );
  }

  const results = await searchPublicContent(query.data.q);
  return NextResponse.json({ results });
}
