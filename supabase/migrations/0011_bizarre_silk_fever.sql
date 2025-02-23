ALTER TABLE "products" ALTER COLUMN "image_url" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "active" boolean DEFAULT false;