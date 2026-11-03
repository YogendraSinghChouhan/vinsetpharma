CREATE TABLE "hero_slides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"image_key" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"alt" text,
	"focus" text DEFAULT 'center' NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "hero_slides_sort_order_idx" ON "hero_slides" ("sort_order");