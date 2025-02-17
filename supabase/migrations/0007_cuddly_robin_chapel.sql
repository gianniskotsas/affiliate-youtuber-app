ALTER TABLE "products" RENAME COLUMN "product_link" TO "short_link";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "original_link" text NOT NULL;