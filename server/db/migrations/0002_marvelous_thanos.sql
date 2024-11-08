ALTER TABLE "links" ADD COLUMN "click" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "stats" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "stats" DROP COLUMN IF EXISTS "click";