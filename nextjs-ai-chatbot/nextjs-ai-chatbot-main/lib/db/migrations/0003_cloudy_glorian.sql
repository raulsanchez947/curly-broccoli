-- Ensure visibility column exists with default and NOT NULL safely
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'Chat' AND column_name = 'visibility'
	) THEN
		ALTER TABLE "Chat" ADD COLUMN "visibility" varchar;
		UPDATE "Chat" SET "visibility" = 'private' WHERE "visibility" IS NULL;
		ALTER TABLE "Chat" ALTER COLUMN "visibility" SET DEFAULT 'private';
		ALTER TABLE "Chat" ALTER COLUMN "visibility" SET NOT NULL;
	END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;