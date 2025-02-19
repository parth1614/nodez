CREATE TABLE IF NOT EXISTS "nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"logo" text NOT NULL,
	"slots" integer NOT NULL,
	"price" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;