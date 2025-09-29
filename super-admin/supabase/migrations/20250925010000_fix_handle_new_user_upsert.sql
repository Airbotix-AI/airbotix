-- Ensure new users can be granted a profile even if email already exists
-- This avoids failures like: Database error granting user

-- Relax profiles.email constraint to allow ON CONFLICT by email
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_email_unique'
  ) THEN
    -- If unique does not exist we create it (some envs already have it from older migration)
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_email_unique UNIQUE (email);
  END IF;
END $$;

-- Replace handle_new_user to upsert by auth user id and email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update the profile for this auth user
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'teacher',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END $$;


