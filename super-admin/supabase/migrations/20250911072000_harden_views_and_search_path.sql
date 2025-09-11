-- =============================================================================
-- HARDEN VIEWS (security_invoker) AND ENSURE FUNCTION search_path IS SET
-- =============================================================================
-- Context:
-- - Supabase Security Advisor flags 10 views as "Security Definer Views".
--   On PostgreSQL 15+, views run with owner privileges by default unless
--   security_invoker=true is set. This migration flips those views to
--   security_invoker and also enables security_barrier for safer predicate
--   handling.
-- - Adds an idempotent safety-net to ensure all public functions have
--   SET search_path=public, covering any functions not explicitly handled.

-- =============================================================================
-- 1) HARDEN PUBLIC VIEWS: set security_invoker=true and security_barrier=true
-- =============================================================================

-- Only apply if the view exists; execute conditionally via DO block
DO $$
BEGIN
  -- workshop_enrollment_summary
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='workshop_enrollment_summary'
  ) THEN
    EXECUTE 'ALTER VIEW public.workshop_enrollment_summary SET (security_invoker = true, security_barrier = true)';
  END IF;

  -- department_summary
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='department_summary'
  ) THEN
    EXECUTE 'ALTER VIEW public.department_summary SET (security_invoker = true, security_barrier = true)';
  END IF;

  -- scheduled_workshops
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='scheduled_workshops'
  ) THEN
    EXECUTE 'ALTER VIEW public.scheduled_workshops SET (security_invoker = true, security_barrier = true)';
  END IF;

  -- completed_workshops
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='completed_workshops'
  ) THEN
    EXECUTE 'ALTER VIEW public.completed_workshops SET (security_invoker = true, security_barrier = true)';
  END IF;

  -- active_students
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='active_students'
  ) THEN
    EXECUTE 'ALTER VIEW public.active_students SET (security_invoker = true, security_barrier = true)';
  END IF;

  -- function_security_status
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='function_security_status'
  ) THEN
    EXECUTE 'ALTER VIEW public.function_security_status SET (security_invoker = true, security_barrier = true)';
  END IF;

  -- recent_user_activity
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='recent_user_activity'
  ) THEN
    EXECUTE 'ALTER VIEW public.recent_user_activity SET (security_invoker = true, security_barrier = true)';
  END IF;

  -- students_by_school
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='students_by_school'
  ) THEN
    EXECUTE 'ALTER VIEW public.students_by_school SET (security_invoker = true, security_barrier = true)';
  END IF;

  -- active_users_by_role
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='active_users_by_role'
  ) THEN
    EXECUTE 'ALTER VIEW public.active_users_by_role SET (security_invoker = true, security_barrier = true)';
  END IF;

  -- students_by_skill_level
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' AND c.relname='students_by_skill_level'
  ) THEN
    EXECUTE 'ALTER VIEW public.students_by_skill_level SET (security_invoker = true, security_barrier = true)';
  END IF;
END$$;

-- Optional: document intent
COMMENT ON VIEW public.workshop_enrollment_summary IS 'Hardened: security_invoker + security_barrier enabled';
COMMENT ON VIEW public.department_summary IS 'Hardened: security_invoker + security_barrier enabled';
COMMENT ON VIEW public.scheduled_workshops IS 'Hardened: security_invoker + security_barrier enabled';
COMMENT ON VIEW public.completed_workshops IS 'Hardened: security_invoker + security_barrier enabled';
COMMENT ON VIEW public.active_students IS 'Hardened: security_invoker + security_barrier enabled';
COMMENT ON VIEW public.function_security_status IS 'Hardened: security_invoker + security_barrier enabled';
COMMENT ON VIEW public.recent_user_activity IS 'Hardened: security_invoker + security_barrier enabled';
COMMENT ON VIEW public.students_by_school IS 'Hardened: security_invoker + security_barrier enabled';
COMMENT ON VIEW public.active_users_by_role IS 'Hardened: security_invoker + security_barrier enabled';
COMMENT ON VIEW public.students_by_skill_level IS 'Hardened: security_invoker + security_barrier enabled';

-- =============================================================================
-- 2) SAFETY-NET: ensure all public functions set search_path=public
-- =============================================================================

DO $$
DECLARE
  r RECORD;
  current_search_path TEXT;
BEGIN
  FOR r IN 
    SELECT p.oid,
           n.nspname AS schema_name,
           p.proname AS function_name,
           pg_get_function_identity_arguments(p.oid) AS identity_args,
           (
             SELECT split_part(conf, '=', 2)
             FROM unnest(p.proconfig) AS conf
             WHERE split_part(conf, '=', 1) = 'search_path'
           ) AS fn_search_path
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
  LOOP
    current_search_path := COALESCE(r.fn_search_path, 'not set');
    IF current_search_path IS DISTINCT FROM 'public' THEN
      EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public', r.schema_name, r.function_name, r.identity_args);
    END IF;
  END LOOP;
END$$;

-- =============================================================================
-- 3) VERIFICATION HELPERS
-- =============================================================================

-- Verify view hardening
SELECT 
  c.relname AS view_name,
  array_to_string(c.reloptions, ',') AS reloptions
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'v'
  AND n.nspname = 'public'
  AND c.relname IN (
    'workshop_enrollment_summary',
    'department_summary',
    'scheduled_workshops',
    'completed_workshops',
    'active_students',
    'function_security_status',
    'recent_user_activity',
    'students_by_school',
    'active_users_by_role',
    'students_by_skill_level'
  )
ORDER BY c.relname;

-- Verify any functions still missing search_path
SELECT 
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS arguments,
  COALESCE(
    (
      SELECT split_part(conf, '=', 2)
      FROM unnest(p.proconfig) AS conf
      WHERE split_part(conf, '=', 1) = 'search_path'
    ),
    'not set'
  ) AS search_path
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND COALESCE(
    (
      SELECT split_part(conf, '=', 2)
      FROM unnest(p.proconfig) AS conf
      WHERE split_part(conf, '=', 1) = 'search_path'
    ),
    'not set'
  ) <> 'public'
ORDER BY p.proname;


