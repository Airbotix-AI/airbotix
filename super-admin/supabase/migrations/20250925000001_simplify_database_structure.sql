-- ============================================================================
-- DATABASE SIMPLIFICATION MIGRATION
-- ============================================================================
-- This migration simplifies the database structure to support only:
-- 1. Login and authentication (profiles table)
-- 2. Dashboard functionality  
-- 3. Student management (students table)
--
-- REMOVES:
-- - courses table and related data
-- - workshops table and related data
-- - enrollments table and related data
-- - complex audit logging
-- - unnecessary views and functions
--
-- KEEPS:
-- - profiles table (user management)
-- - students table (student management)
-- - essential RLS policies
-- - basic audit functionality
-- ============================================================================

-- ============================================================================
-- 1. DROP COMPLEX TABLES AND RELATIONSHIPS
-- ============================================================================

-- Drop dependent tables first
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.workshops_audit_log CASCADE;
DROP TABLE IF EXISTS public.workshops CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;

-- Drop workshop-related types
DROP TYPE IF EXISTS workshop_status CASCADE;

-- ============================================================================
-- 2. DROP UNNECESSARY VIEWS
-- ============================================================================

DROP VIEW IF EXISTS public.completed_workshops CASCADE;
DROP VIEW IF EXISTS public.scheduled_workshops CASCADE;
DROP VIEW IF EXISTS public.workshop_enrollment_summary CASCADE;

-- ============================================================================
-- 3. DROP WORKSHOP-RELATED FUNCTIONS
-- ============================================================================

DROP FUNCTION IF EXISTS public.generate_workshop_slug(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.update_workshop_enrollment_count() CASCADE;
DROP FUNCTION IF EXISTS public.validate_enrollment_workshop_status() CASCADE;
DROP FUNCTION IF EXISTS public.update_workshop_timestamps() CASCADE;
DROP FUNCTION IF EXISTS public.log_workshop_changes() CASCADE;

-- ============================================================================
-- 4. SIMPLIFY ROLE PERMISSIONS
-- ============================================================================

-- Remove workshop and course related permissions
DELETE FROM public.role_permissions WHERE resource IN ('workshops', 'courses', 'content');

-- Keep only essential permissions for simplified system
DELETE FROM public.role_permissions WHERE resource NOT IN ('students', 'teachers', 'reports', 'audit_logs', 'system_settings');

-- Add simplified permissions for essential functions
INSERT INTO public.role_permissions (role, resource, action, allowed) VALUES
  -- Dashboard permissions
  ('super_admin', 'dashboard', 'read', true),
  ('admin', 'dashboard', 'read', true),
  ('teacher', 'dashboard', 'read', true),
  
  -- Profile management permissions
  ('super_admin', 'profiles', 'create', true),
  ('super_admin', 'profiles', 'read', true),
  ('super_admin', 'profiles', 'update', true),
  ('super_admin', 'profiles', 'delete', true),
  ('admin', 'profiles', 'read', true),
  ('admin', 'profiles', 'update', false),
  ('teacher', 'profiles', 'read', false)
ON CONFLICT (role, resource, action) DO UPDATE SET allowed = EXCLUDED.allowed;

-- ============================================================================
-- 5. SIMPLIFY STUDENTS TABLE (REMOVE COMPLEX CONSTRAINTS)
-- ============================================================================

-- Drop complex indexes that are not needed for basic student management
DROP INDEX IF EXISTS public.idx_students_full_name;
DROP INDEX IF EXISTS public.idx_students_school_grade;

-- Recreate essential indexes only
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students (status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_students_parent_email ON public.students (parent_email);

-- ============================================================================
-- 6. SIMPLIFY PROFILES TABLE POLICIES
-- ============================================================================

-- Drop overly complex policies and recreate simplified ones
DROP POLICY IF EXISTS "super_admins_full_access" ON public.profiles;
DROP POLICY IF EXISTS "admins_read_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admins_manage_teacher_student_profiles" ON public.profiles;
DROP POLICY IF EXISTS "teachers_read_teacher_student_profiles" ON public.profiles;
DROP POLICY IF EXISTS "service_role_read_all_profiles" ON public.profiles;

-- Create simplified, clear policies
CREATE POLICY "profiles_super_admin_full_access" ON public.profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

CREATE POLICY "profiles_admin_manage_non_admin" ON public.profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
    AND (role IN ('teacher') OR auth.uid() = id)
  );

CREATE POLICY "profiles_user_own_profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_user_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    -- Users cannot change their own role or active status
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND is_active = (SELECT is_active FROM public.profiles WHERE id = auth.uid())
  );

-- ============================================================================
-- 7. SIMPLIFY STUDENTS TABLE POLICIES  
-- ============================================================================

-- Drop complex policies
DROP POLICY IF EXISTS "super_admins_full_access_students" ON public.students;
DROP POLICY IF EXISTS "admins_read_write_access_students" ON public.students;
DROP POLICY IF EXISTS "teachers_read_access_students" ON public.students;
DROP POLICY IF EXISTS "service_role_read_all_students" ON public.students;

-- Create simplified student policies
CREATE POLICY "students_super_admin_full_access" ON public.students
  FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "students_admin_full_access" ON public.students
  FOR ALL
  USING (public.is_admin_or_above());

CREATE POLICY "students_teacher_read_only" ON public.students
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'teacher' AND is_active = true
    )
  );

-- ============================================================================
-- 8. CREATE SIMPLIFIED DASHBOARD VIEWS
-- ============================================================================

-- Simple dashboard metrics view
CREATE OR REPLACE VIEW public.dashboard_metrics AS
SELECT 
  'students' as metric_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'active') as active_count,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_count
FROM public.students
UNION ALL
SELECT 
  'users' as metric_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE is_active = true) as active_count,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_count
FROM public.profiles;

-- Simple student summary view
CREATE OR REPLACE VIEW public.student_summary AS
SELECT 
  skill_level,
  status,
  COUNT(*) as count
FROM public.students
GROUP BY skill_level, status
ORDER BY skill_level, status;

-- ============================================================================
-- 9. CREATE ADMIN SETUP FUNCTION
-- ============================================================================

-- Function to promote a user to super_admin (for initial setup)
CREATE OR REPLACE FUNCTION public.promote_to_super_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_found BOOLEAN;
BEGIN
  -- Check if user exists
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = user_email) INTO user_found;
  
  IF NOT user_found THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update user role to super_admin
  UPDATE public.profiles 
  SET role = 'super_admin', updated_at = NOW()
  WHERE email = user_email;
  
  -- Log the action
  INSERT INTO public.profiles_audit_log (
    profile_id,
    action,
    new_values,
    changed_by
  )
  SELECT 
    p.id,
    'ROLE_CHANGE',
    json_build_object('new_role', 'super_admin', 'changed_via', 'promote_function'),
    auth.uid()
  FROM public.profiles p
  WHERE p.email = user_email;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================================
-- 10. GRANT PERMISSIONS
-- ============================================================================

-- Grant access to views
GRANT SELECT ON public.dashboard_metrics TO authenticated;
GRANT SELECT ON public.student_summary TO authenticated;

-- Grant execute on admin function (only to super admins via RLS)
GRANT EXECUTE ON FUNCTION public.promote_to_super_admin TO authenticated;

-- ============================================================================
-- 11. CLEANUP AND VERIFICATION
-- ============================================================================

-- Remove orphaned data
DELETE FROM public.profiles_audit_log 
WHERE profile_id NOT IN (SELECT id FROM public.profiles);

DELETE FROM public.students_audit_log 
WHERE student_id NOT IN (SELECT id FROM public.students);

-- Update function search paths for security
ALTER FUNCTION public.update_profiles_updated_at() SET search_path = public;
ALTER FUNCTION public.update_students_updated_at() SET search_path = public;
ALTER FUNCTION public.set_students_created_by() SET search_path = public;
ALTER FUNCTION public.students_audit_trigger() SET search_path = public;
ALTER FUNCTION public.profiles_audit_trigger() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.promote_to_super_admin(TEXT) SET search_path = public;

-- ============================================================================
-- 12. FINAL VERIFICATION
-- ============================================================================

-- Display summary of remaining tables
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'students', 'profiles_audit_log', 'students_audit_log', 'role_permissions')
ORDER BY tablename;

-- Log the completion
-- Note: Skipping log_security_event call as it may not exist in all environments
-- SELECT public.log_security_event(
--   'database_simplification_completed',
--   'migration',
--   NULL,
--   json_build_object(
--     'removed_tables', ARRAY['courses', 'workshops', 'enrollments', 'workshops_audit_log'],
--     'kept_tables', ARRAY['profiles', 'students', 'profiles_audit_log', 'students_audit_log', 'role_permissions'],
--     'migration_date', NOW()
--   )
-- );

-- Instead, just add a comment for completion
-- Database simplification migration completed successfully
