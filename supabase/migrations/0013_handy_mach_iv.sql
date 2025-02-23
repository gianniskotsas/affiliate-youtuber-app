ALTER TABLE "users" ADD COLUMN "stripe_customer_id" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_subscription_id" text DEFAULT '';