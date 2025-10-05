-- Fix profiles_audit_trigger function to use to_jsonb() instead of row_to_json()
-- This resolves the "operator does not exist: json = json" error

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS trigger_profiles_audit ON public.profiles;

-- Recreate the audit trigger function with fixed JSON comparison
CREATE OR REPLACE FUNCTION public.profiles_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.profiles_audit_log (profile_id, action, old_values, changed_by)
    VALUES (OLD.id, 'DELETE', to_jsonb(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log if there are actual changes
    -- Use to_jsonb() for proper JSON comparison
    IF to_jsonb(OLD) IS DISTINCT FROM to_jsonb(NEW) THEN
      INSERT INTO public.profiles_audit_log (profile_id, action, old_values, new_values, changed_by)
      VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.profiles_audit_log (profile_id, action, new_values, changed_by)
    VALUES (NEW.id, 'INSERT', to_jsonb(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the audit trigger
CREATE TRIGGER trigger_profiles_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_audit_trigger();

-- Set search path for security
ALTER FUNCTION public.profiles_audit_trigger() SET search_path = public;
