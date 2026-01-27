-- Ensure Document.text column exists with default and NOT NULL safely
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'Document' AND column_name = 'text'
	) THEN
		ALTER TABLE "Document" ADD COLUMN "text" varchar;
		UPDATE "Document" SET "text" = 'text' WHERE "text" IS NULL;
		ALTER TABLE "Document" ALTER COLUMN "text" SET DEFAULT 'text';
		ALTER TABLE "Document" ALTER COLUMN "text" SET NOT NULL;
	END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;