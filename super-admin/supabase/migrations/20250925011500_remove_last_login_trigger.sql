-- Remove auth.users last_login trigger that updates a non-existent profiles.last_login_at
-- Symptom: Auth callback fails with "Database error granting user" due to trigger failure

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_login'
  ) THEN
    DROP TRIGGER on_auth_user_login ON auth.users;
  END IF;
END $$;

-- Optionally drop the function to avoid future misuse
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'update_last_login'
  ) THEN
    DROP FUNCTION public.update_last_login();
  END IF;
END $$;


