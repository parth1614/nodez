ALTER TABLE "orders" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "order_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_id" text;