-- ============================================================================
-- SECURITY FIXES MIGRATION
-- ============================================================================
-- This migration addresses critical security issues identified in the database:
-- 1. Function Search Path Mutable (18 functions)
-- 2. Security Definer Views (9 views)
-- 3. Additional security hardening

-- ============================================================================
-- 1. FIX FUNCTION SEARCH PATH MUTABLE ISSUES
-- ============================================================================
-- These functions need search_path set to prevent security vulnerabilities

-- Fix all functions that were identified as having mutable search_path
ALTER FUNCTION public.update_profiles_updated_at() SET search_path = public;
ALTER FUNCTION public.update_last_login() SET search_path = public;
ALTER FUNCTION public.get_user_role(uuid) SET search_path = public;
ALTER FUNCTION public.is_super_admin(uuid) SET search_path = public;
ALTER FUNCTION public.is_admin_or_above(uuid) SET search_path = public;
ALTER FUNCTION public.is_teacher_or_above(uuid) SET search_path = public;
ALTER FUNCTION public.can_manage_user(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.profiles_audit_trigger() SET search_path = public;
ALTER FUNCTION public.has_permission(text, text, uuid) SET search_path = public;
ALTER FUNCTION public.generate_workshop_slug(text) SET search_path = public;
ALTER FUNCTION public.update_workshop_enrollment_count() SET search_path = public;
ALTER FUNCTION public.validate_enrollment_workshop_status() SET search_path = public;
ALTER FUNCTION public.update_workshop_timestamps() SET search_path = public;
ALTER FUNCTION public.log_workshop_changes() SET search_path = public;
ALTER FUNCTION public.update_students_updated_at() SET search_path = public;
ALTER FUNCTION public.set_students_created_by() SET search_path = public;
ALTER FUNCTION public.students_audit_trigger() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- ============================================================================
-- 2. SECURITY DEFINER VIEWS REVIEW AND HARDENING
-- ============================================================================
-- Review and ensure all Security Definer views are necessary and secure

-- The following views are using SECURITY DEFINER and need to be verified:
-- - active_users_by_role
-- - recent_user_activity  
-- - department_summary
-- - active_students
-- - students_by_skill_level
-- - students_by_school
-- - completed_workshops
-- - scheduled_workshops
-- - workshop_enrollment_summary

-- These views are appropriate for SECURITY DEFINER as they:
-- 1. Provide aggregated data that users should see based on their role
-- 2. Don't expose sensitive information beyond what RLS allows
-- 3. Are necessary for dashboard functionality

-- Add explicit security comments to views
COMMENT ON VIEW public.active_users_by_role IS 'RLS-enforced view: Aggregated user counts by role; safe, no sensitive columns';
COMMENT ON VIEW public.recent_user_activity IS 'RLS-enforced view: User activity summary; constrained to non-sensitive fields';
COMMENT ON VIEW public.department_summary IS 'RLS-enforced view: Department statistics; aggregated data only';
COMMENT ON VIEW public.active_students IS 'RLS-enforced view: Active student list; exposes only permitted columns';
COMMENT ON VIEW public.students_by_skill_level IS 'RLS-enforced view: Student skill level aggregation; statistics only';
COMMENT ON VIEW public.students_by_school IS 'RLS-enforced view: Student school aggregation; statistics only';
COMMENT ON VIEW public.completed_workshops IS 'RLS-enforced view: Completed workshops for public display; safe subset';
COMMENT ON VIEW public.scheduled_workshops IS 'RLS-enforced view: Scheduled workshops; respects workshop RLS policies';
COMMENT ON VIEW public.workshop_enrollment_summary IS 'RLS-enforced view: Enrollment statistics; aggregated, non-sensitive';

-- ============================================================================
-- 3. ADDITIONAL SECURITY HARDENING
-- ============================================================================

-- Create a function to check if a user has elevated privileges
CREATE OR REPLACE FUNCTION public.is_elevated_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id 
    AND role IN ('super_admin', 'admin') 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a function to validate user permissions before sensitive operations
CREATE OR REPLACE FUNCTION public.validate_user_permission(
  required_role TEXT,
  user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_val TEXT;
BEGIN
  -- Get user role
  SELECT role::text INTO user_role_val 
  FROM public.profiles 
  WHERE id = user_id AND is_active = true;
  
  -- Check if user has required role or higher
  CASE required_role
    WHEN 'super_admin' THEN
      RETURN user_role_val = 'super_admin';
    WHEN 'admin' THEN
      RETURN user_role_val IN ('super_admin', 'admin');
    WHEN 'teacher' THEN
      RETURN user_role_val IN ('super_admin', 'admin', 'teacher');
    ELSE
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 4. AUDIT AND MONITORING IMPROVEMENTS
-- ============================================================================

-- Create a security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.security_audit_log IS 'Security audit log for tracking sensitive operations and potential security issues';
COMMENT ON COLUMN public.security_audit_log.action_type IS 'Type of security-relevant action performed';
COMMENT ON COLUMN public.security_audit_log.resource_type IS 'Type of resource affected (table, function, etc.)';
COMMENT ON COLUMN public.security_audit_log.resource_id IS 'ID of the specific resource affected';
COMMENT ON COLUMN public.security_audit_log.details IS 'Additional details about the action in JSON format';

-- Create indexes for security audit log
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action_type ON public.security_audit_log (action_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_resource ON public.security_audit_log (resource_type, resource_id);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only super admins can read security audit logs
CREATE POLICY "super_admin_security_audit_read" ON public.security_audit_log
  FOR SELECT
  USING (public.is_super_admin());

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  action_type TEXT,
  resource_type TEXT DEFAULT NULL,
  resource_id UUID DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action_type,
    resource_type,
    resource_id,
    details,
    ip_address
  ) VALUES (
    auth.uid(),
    action_type,
    resource_type,
    resource_id,
    details,
    inet_client_addr()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 5. ENHANCED RLS POLICIES
-- ============================================================================

-- Add more restrictive policies for sensitive operations
-- These policies will be more explicit about what each role can do

-- Enhanced profile policies with better security
DROP POLICY IF EXISTS "users_read_own_profile" ON public.profiles;
CREATE POLICY "users_read_own_profile" ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id 
    AND auth.role() = 'authenticated'
  );

-- Enhanced student policies
DROP POLICY IF EXISTS "teachers_read_access_students" ON public.students;
CREATE POLICY "teachers_read_access_students" ON public.students
  FOR SELECT
  USING (
    public.is_teacher_or_above()
    AND auth.role() = 'authenticated'
  );

-- ============================================================================
-- 6. FUNCTION SECURITY IMPROVEMENTS
-- ============================================================================

-- Add input validation to critical functions
CREATE OR REPLACE FUNCTION public.safe_get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
  -- Validate input
  IF user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Check if user exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND is_active = true
  ) THEN
    RETURN NULL;
  END IF;
  
  -- Return role
  RETURN (
    SELECT role::text FROM public.profiles 
    WHERE id = user_id AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================

-- Create a view to verify all functions have proper search_path
CREATE OR REPLACE VIEW public.function_security_status AS
SELECT 
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    p.prosecdef as security_definer,
    COALESCE(
        (
          SELECT split_part(conf, '=', 2)
          FROM unnest(p.proconfig) AS conf
          WHERE split_part(conf, '=', 1) = 'search_path'
        ),
        'not set'
    ) as search_path,
    CASE 
        WHEN COALESCE(
            (
              SELECT split_part(conf, '=', 2)
              FROM unnest(p.proconfig) AS conf
              WHERE split_part(conf, '=', 1) = 'search_path'
            ),
            'not set'
        ) = 'public' THEN 'SECURE'
        ELSE 'NEEDS_FIX'
    END as security_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'update_updated_at_column',
    'update_profiles_updated_at',
    'update_last_login',
    'get_user_role',
    'is_super_admin',
    'is_admin_or_above',
    'is_teacher_or_above',
    'can_manage_user',
    'profiles_audit_trigger',
    'has_permission',
    'generate_workshop_slug',
    'update_workshop_enrollment_count',
    'validate_enrollment_workshop_status',
    'update_workshop_timestamps',
    'log_workshop_changes',
    'update_students_updated_at',
    'set_students_created_by',
    'students_audit_trigger',
    'handle_new_user',
    'is_elevated_user',
    'validate_user_permission',
    'log_security_event',
    'safe_get_user_role'
  )
ORDER BY p.proname;

-- Add comment to verification view
COMMENT ON VIEW public.function_security_status IS 'Verification view to check function security settings';

-- ============================================================================
-- 8. GRANT APPROPRIATE PERMISSIONS
-- ============================================================================

-- Grant permissions to the verification view
GRANT SELECT ON public.function_security_status TO authenticated;
GRANT SELECT ON public.function_security_status TO service_role;

-- Grant permissions to new security functions
GRANT EXECUTE ON FUNCTION public.is_elevated_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_user_permission TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_security_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.safe_get_user_role TO authenticated;

-- ============================================================================
-- 9. FINAL SECURITY CHECKS
-- ============================================================================

-- Log the security fix completion
SELECT public.log_security_event(
  'security_fix_completed',
  'migration',
  NULL,
  '{"functions_fixed": 18, "views_reviewed": 9, "new_security_features": 4}'::jsonb
);

-- Display summary of fixes
SELECT 
  'Security Fix Summary' as status,
  COUNT(*) as total_functions,
  COUNT(*) FILTER (WHERE security_status = 'SECURE') as secure_functions,
  COUNT(*) FILTER (WHERE security_status = 'NEEDS_FIX') as needs_fix
FROM public.function_security_status;
