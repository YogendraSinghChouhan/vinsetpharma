CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"type" text NOT NULL,
	"file_key" text NOT NULL,
	"poster_key" text,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"duration_seconds" integer,
	"caption" text,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "media_sort_order_idx" ON "media" ("sort_order");