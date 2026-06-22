CREATE TABLE "audit_assignees" (
	"id" text PRIMARY KEY NOT NULL,
	"audit_id" text NOT NULL,
	"user_id" text NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audits" DROP CONSTRAINT "audits_assigned_to_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "audits_assigned_idx";--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_assignees" ADD CONSTRAINT "audit_assignees_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_assignees" ADD CONSTRAINT "audit_assignees_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "audit_assignees_audit_user_uidx" ON "audit_assignees" USING btree ("audit_id","user_id");--> statement-breakpoint
CREATE INDEX "audit_assignees_user_idx" ON "audit_assignees" USING btree ("user_id");--> statement-breakpoint
INSERT INTO "audit_assignees" ("id", "audit_id", "user_id") SELECT gen_random_uuid(), "id", "assigned_to_id" FROM "audits" WHERE "assigned_to_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "audits" DROP COLUMN "assigned_to_id";