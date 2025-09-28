-- Set views to run with the privileges of the querying user instead of the view owner
-- This addresses Security Advisor "Security Definer View" findings

DO $$
BEGIN
  -- dashboard_metrics
  IF EXISTS (
    SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'dashboard_metrics'
  ) THEN
    ALTER VIEW public.dashboard_metrics SET (security_invoker = true);
  END IF;

  -- student_summary
  IF EXISTS (
    SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'student_summary'
  ) THEN
    ALTER VIEW public.student_summary SET (security_invoker = true);
  END IF;
END $$;


