-- Add dashboard access policy for development
-- This allows viewing data in Supabase Dashboard Table Editor

-- Add a policy to allow service_role to read all profiles data
-- This is needed for Supabase Dashboard to display data in Table Editor
CREATE POLICY "service_role_read_all_profiles" ON public.profiles
  FOR SELECT
  USING (
    -- Allow service_role (Dashboard) to read all data
    auth.role() = 'service_role' OR
    -- Keep existing authenticated user policies
    auth.uid() = id OR
    public.is_super_admin() OR
    public.is_admin_or_above() OR
    (public.is_teacher_or_above() AND role IN ('teacher', 'student'))
  );

-- Add similar policy for students table
CREATE POLICY "service_role_read_all_students" ON public.students
  FOR SELECT
  USING (
    -- Allow service_role (Dashboard) to read all data
    auth.role() = 'service_role' OR
    -- Keep existing policies
    public.is_super_admin() OR
    public.is_admin_or_above() OR
    public.get_user_role() = 'teacher'
  );

-- Add policy for role_permissions table
CREATE POLICY "service_role_read_role_permissions" ON public.role_permissions
  FOR SELECT
  USING (
    -- Allow service_role (Dashboard) to read all data
    auth.role() = 'service_role' OR
    -- Keep existing authenticated access
    auth.role() = 'authenticated'
  );

-- Add policy for audit logs
CREATE POLICY "service_role_read_profiles_audit" ON public.profiles_audit_log
  FOR SELECT
  USING (
    -- Allow service_role (Dashboard) to read all data
    auth.role() = 'service_role' OR
    -- Keep existing admin access
    public.is_admin_or_above()
  );

CREATE POLICY "service_role_read_students_audit" ON public.students_audit_log
  FOR SELECT
  USING (
    -- Allow service_role (Dashboard) to read all data
    auth.role() = 'service_role' OR
    -- Keep existing admin access
    public.is_admin_or_above()
  );

