-- Ensure profiles table constraints do not block auth grant path

-- Drop NOT NULL on full_name if present to avoid grant-time failures
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.profiles ALTER COLUMN full_name DROP NOT NULL;
  END IF;
END $$;

-- Ensure role has a default value
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'teacher';


