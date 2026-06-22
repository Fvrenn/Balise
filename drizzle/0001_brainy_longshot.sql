CREATE TABLE "audit_assignees" (
	"id" text PRIMARY KEY NOT NULL,
	"audit_id" text NOT NULL,
	"user_id" text NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_assignees" ADD CONSTRAINT "audit_assignees_audit_id_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_assignees" ADD CONSTRAINT "audit_assignees_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "audit_assignees_audit_user_uidx" ON "audit_assignees" USING btree ("audit_id","user_id");--> statement-breakpoint
CREATE INDEX "audit_assignees_user_idx" ON "audit_assignees" USING btree ("user_id");--> statement-breakpoint
-- Reprise des assignations existantes (passage mono-auditeur → multi) : chaque audit
-- portant un assigned_to_id devient une ligne audit_assignees AVANT que la colonne ne
-- soit supprimée. assigned_at reprend la date de création de l'audit. Le nombre de
-- lignes reprises est journalisé via RAISE NOTICE.
DO $$
DECLARE
	migrated_count integer;
BEGIN
	INSERT INTO "audit_assignees" ("id", "audit_id", "user_id", "assigned_at")
	SELECT gen_random_uuid(), "id", "assigned_to_id", COALESCE("created_at", now())
	FROM "audits"
	WHERE "assigned_to_id" IS NOT NULL
	ON CONFLICT ("audit_id", "user_id") DO NOTHING;
	GET DIAGNOSTICS migrated_count = ROW_COUNT;
	RAISE NOTICE 'audit_assignees: % assignation(s) reprise(s) depuis audits.assigned_to_id', migrated_count;
END $$;
--> statement-breakpoint
ALTER TABLE "audits" DROP CONSTRAINT IF EXISTS "audits_assigned_to_id_user_id_fk";--> statement-breakpoint
DROP INDEX IF EXISTS "audits_assigned_idx";--> statement-breakpoint
ALTER TABLE "audits" DROP COLUMN "assigned_to_id";
