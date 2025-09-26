-- Robust handle_new_user to resolve duplicate email conflicts gracefully
-- Symptom addressed: Auth callback error "Database error granting user"

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_id uuid;
BEGIN
  -- 1) If a profile with the same email exists but with a different id, re-link it to this auth user id
  SELECT id INTO existing_id FROM public.profiles WHERE email = NEW.email LIMIT 1;
  IF existing_id IS NOT NULL AND existing_id <> NEW.id THEN
    UPDATE public.profiles
      SET id = NEW.id,
          full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
          updated_at = NOW()
      WHERE email = NEW.email;
  END IF;

  -- 2) Upsert by id to ensure the row exists for this auth user
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


