-- Ensure lastContext exists on Chat
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_schema = 'public' AND table_name = 'Chat' AND column_name = 'lastContext'
	) THEN
		ALTER TABLE "Chat" ADD COLUMN "lastContext" jsonb;
	END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;