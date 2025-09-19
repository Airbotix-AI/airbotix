-- User profiles and role-based access control migration
-- Creates comprehensive RBAC system with proper constraints, indexes, and RLS policies

-- Create user role enum with proper hierarchy
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin', 
  'teacher',
  'student'
);

-- Create user profiles table extending auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL CHECK (length(trim(full_name)) >= 2),
  role user_role NOT NULL DEFAULT 'teacher',
  phone VARCHAR(20) CHECK (
    phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$'
  ),
  avatar_url TEXT CHECK (
    avatar_url IS NULL OR 
    avatar_url ~ '^https?://[^\s/$.?#].[^\s]*$'
  ),
  department VARCHAR(100),
  employee_id VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure email uniqueness
  CONSTRAINT profiles_email_unique UNIQUE (email)
);

-- Add table comments for documentation
COMMENT ON TABLE public.profiles IS 'Extended user profiles with role-based access control information';

-- Add column comments
COMMENT ON COLUMN public.profiles.id IS 'References auth.users.id - primary key and foreign key';
COMMENT ON COLUMN public.profiles.email IS 'User email address (must be unique)';
COMMENT ON COLUMN public.profiles.full_name IS 'User full legal name';
COMMENT ON COLUMN public.profiles.role IS 'User role determining access permissions';
COMMENT ON COLUMN public.profiles.phone IS 'User phone number (optional)';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user profile picture';
COMMENT ON COLUMN public.profiles.department IS 'Department or team the user belongs to';
COMMENT ON COLUMN public.profiles.employee_id IS 'Employee identification number';
COMMENT ON COLUMN public.profiles.is_active IS 'Whether the user account is active';
COMMENT ON COLUMN public.profiles.last_login_at IS 'Timestamp of last successful login';
COMMENT ON COLUMN public.profiles.password_changed_at IS 'Timestamp of last password change';
COMMENT ON COLUMN public.profiles.created_at IS 'Account creation timestamp';
COMMENT ON COLUMN public.profiles.updated_at IS 'Account last update timestamp';

-- Create indexes for performance optimization
CREATE INDEX idx_profiles_email ON public.profiles (email);
CREATE INDEX idx_profiles_role ON public.profiles (role);
CREATE INDEX idx_profiles_is_active ON public.profiles (is_active);
CREATE INDEX idx_profiles_full_name ON public.profiles USING gin(to_tsvector('english', full_name));
CREATE INDEX idx_profiles_department ON public.profiles (department);
CREATE INDEX idx_profiles_employee_id ON public.profiles (employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX idx_profiles_created_at ON public.profiles (created_at DESC);
CREATE INDEX idx_profiles_last_login ON public.profiles (last_login_at DESC) WHERE last_login_at IS NOT NULL;

-- Composite indexes for common queries
CREATE INDEX idx_profiles_role_active ON public.profiles (role, is_active);
CREATE INDEX idx_profiles_department_role ON public.profiles (department, role) WHERE department IS NOT NULL;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
    'teacher',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update last login timestamp
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
    UPDATE public.profiles 
    SET last_login_at = NEW.last_sign_in_at
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to track login times
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_last_login();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checking (redefining to ensure they exist)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role::text FROM public.profiles 
    WHERE id = user_id AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'super_admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_above(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id 
    AND role IN ('super_admin', 'admin') 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_teacher_or_above(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id 
    AND role IN ('super_admin', 'admin', 'teacher') 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can manage other user
CREATE OR REPLACE FUNCTION public.can_manage_user(target_user_id UUID, current_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
  current_role TEXT;
  target_role TEXT;
BEGIN
  -- Get roles
  SELECT role::text INTO current_role FROM public.profiles WHERE id = current_user_id AND is_active = true;
  SELECT role::text INTO target_role FROM public.profiles WHERE id = target_user_id;
  
  -- Super admins can manage everyone
  IF current_role = 'super_admin' THEN
    RETURN true;
  END IF;
  
  -- Admins can manage teachers and students, but not other admins or super admins
  IF current_role = 'admin' AND target_role IN ('teacher', 'student') THEN
    RETURN true;
  END IF;
  
  -- Users can manage themselves (update their own profile)
  IF current_user_id = target_user_id THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for profiles table

-- Users can always read their own profile
CREATE POLICY "users_read_own_profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except role and is_active)
CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND is_active = (SELECT is_active FROM public.profiles WHERE id = auth.uid())
  );

-- Super admins have full access to all profiles
CREATE POLICY "super_admins_full_access" ON public.profiles
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Admins can read all profiles and manage teacher/student profiles
CREATE POLICY "admins_read_all_profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin_or_above());

CREATE POLICY "admins_manage_teacher_student_profiles" ON public.profiles
  FOR ALL
  USING (
    public.is_admin_or_above() 
    AND (role IN ('teacher', 'student') OR auth.uid() = id)
  )
  WITH CHECK (
    public.is_admin_or_above()
    AND (role IN ('teacher', 'student') OR auth.uid() = id)
  );

-- Teachers can read other teacher and student profiles (for collaboration)
CREATE POLICY "teachers_read_teacher_student_profiles" ON public.profiles
  FOR SELECT
  USING (
    public.is_teacher_or_above()
    AND role IN ('teacher', 'student')
  );

-- Create audit log table for profile changes
CREATE TABLE public.profiles_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Add comments to profiles audit log
COMMENT ON TABLE public.profiles_audit_log IS 'Audit log for tracking all changes to user profiles';
COMMENT ON COLUMN public.profiles_audit_log.profile_id IS 'Reference to the user profile';
COMMENT ON COLUMN public.profiles_audit_log.action IS 'Type of action performed (INSERT, UPDATE, DELETE)';
COMMENT ON COLUMN public.profiles_audit_log.old_values IS 'Previous values before the change (JSON)';
COMMENT ON COLUMN public.profiles_audit_log.new_values IS 'New values after the change (JSON)';
COMMENT ON COLUMN public.profiles_audit_log.changed_by IS 'User who made the change';
COMMENT ON COLUMN public.profiles_audit_log.changed_at IS 'Timestamp when the change occurred';
COMMENT ON COLUMN public.profiles_audit_log.ip_address IS 'IP address of the user making the change';
COMMENT ON COLUMN public.profiles_audit_log.user_agent IS 'User agent string of the client';

-- Create indexes for profiles audit log
CREATE INDEX idx_profiles_audit_log_profile_id ON public.profiles_audit_log (profile_id);
CREATE INDEX idx_profiles_audit_log_changed_at ON public.profiles_audit_log (changed_at DESC);
CREATE INDEX idx_profiles_audit_log_action ON public.profiles_audit_log (action);
CREATE INDEX idx_profiles_audit_log_changed_by ON public.profiles_audit_log (changed_by);

-- Enable RLS on profiles audit log
ALTER TABLE public.profiles_audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log policies (only admins and super admins can read audit logs)
CREATE POLICY "admins_read_profiles_audit_log" ON public.profiles_audit_log
  FOR SELECT
  USING (public.is_admin_or_above());

-- Create audit trigger function for profiles
CREATE OR REPLACE FUNCTION public.profiles_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.profiles_audit_log (profile_id, action, old_values, changed_by)
    VALUES (OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log if there are actual changes
    IF row_to_json(OLD) IS DISTINCT FROM row_to_json(NEW) THEN
      INSERT INTO public.profiles_audit_log (profile_id, action, old_values, new_values, changed_by)
      VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), auth.uid());
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.profiles_audit_log (profile_id, action, new_values, changed_by)
    VALUES (NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for profiles
CREATE TRIGGER trigger_profiles_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_audit_trigger();

-- Create role permissions table for granular permissions
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL,
  allowed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure unique combination
  CONSTRAINT role_permissions_unique UNIQUE (role, resource, action)
);

-- Add comments to role permissions
COMMENT ON TABLE public.role_permissions IS 'Granular permissions for each role on specific resources';
COMMENT ON COLUMN public.role_permissions.role IS 'User role';
COMMENT ON COLUMN public.role_permissions.resource IS 'Resource name (e.g., students, teachers, workshops)';
COMMENT ON COLUMN public.role_permissions.action IS 'Action type (e.g., create, read, update, delete)';
COMMENT ON COLUMN public.role_permissions.allowed IS 'Whether the action is allowed for this role';

-- Create indexes for role permissions
CREATE INDEX idx_role_permissions_role ON public.role_permissions (role);
CREATE INDEX idx_role_permissions_resource ON public.role_permissions (resource);
CREATE INDEX idx_role_permissions_role_resource ON public.role_permissions (role, resource);

-- Enable RLS on role permissions
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Role permissions policies (read-only for authenticated users, manage for admins)
CREATE POLICY "authenticated_read_role_permissions" ON public.role_permissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "admins_manage_role_permissions" ON public.role_permissions
  FOR ALL
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

-- Insert default role permissions
INSERT INTO public.role_permissions (role, resource, action, allowed) VALUES
  -- Super admin permissions (full access to everything)
  ('super_admin', 'students', 'create', true),
  ('super_admin', 'students', 'read', true),
  ('super_admin', 'students', 'update', true),
  ('super_admin', 'students', 'delete', true),
  ('super_admin', 'teachers', 'create', true),
  ('super_admin', 'teachers', 'read', true),
  ('super_admin', 'teachers', 'update', true),
  ('super_admin', 'teachers', 'delete', true),
  ('super_admin', 'workshops', 'create', true),
  ('super_admin', 'workshops', 'read', true),
  ('super_admin', 'workshops', 'update', true),
  ('super_admin', 'workshops', 'delete', true),
  ('super_admin', 'courses', 'create', true),
  ('super_admin', 'courses', 'read', true),
  ('super_admin', 'courses', 'update', true),
  ('super_admin', 'courses', 'delete', true),
  ('super_admin', 'content', 'create', true),
  ('super_admin', 'content', 'read', true),
  ('super_admin', 'content', 'update', true),
  ('super_admin', 'content', 'delete', true),
  ('super_admin', 'reports', 'read', true),
  ('super_admin', 'audit_logs', 'read', true),
  ('super_admin', 'system_settings', 'update', true),
  
  -- Admin permissions
  ('admin', 'students', 'create', true),
  ('admin', 'students', 'read', true),
  ('admin', 'students', 'update', true),
  ('admin', 'students', 'delete', true),
  ('admin', 'teachers', 'create', true),
  ('admin', 'teachers', 'read', true),
  ('admin', 'teachers', 'update', true),
  ('admin', 'teachers', 'delete', false),
  ('admin', 'workshops', 'create', true),
  ('admin', 'workshops', 'read', true),
  ('admin', 'workshops', 'update', true),
  ('admin', 'workshops', 'delete', true),
  ('admin', 'courses', 'create', true),
  ('admin', 'courses', 'read', true),
  ('admin', 'courses', 'update', true),
  ('admin', 'courses', 'delete', true),
  ('admin', 'content', 'create', true),
  ('admin', 'content', 'read', true),
  ('admin', 'content', 'update', true),
  ('admin', 'content', 'delete', true),
  ('admin', 'reports', 'read', true),
  
  -- Teacher permissions
  ('teacher', 'students', 'create', false),
  ('teacher', 'students', 'read', true),
  ('teacher', 'students', 'update', false),
  ('teacher', 'students', 'delete', false),
  ('teacher', 'teachers', 'read', true),
  ('teacher', 'workshops', 'read', true),
  ('teacher', 'workshops', 'update', false),
  ('teacher', 'courses', 'read', true),
  ('teacher', 'content', 'read', true),
  ('teacher', 'reports', 'read', false),
  
  -- Student permissions (minimal)
  ('student', 'students', 'read', false),
  ('student', 'workshops', 'read', false),
  ('student', 'courses', 'read', false),
  ('student', 'content', 'read', false);

-- Function to check user permission
CREATE OR REPLACE FUNCTION public.has_permission(
  resource_name TEXT,
  action_name TEXT,
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
  
  -- If no role found, deny access
  IF user_role_val IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check permission
  RETURN EXISTS (
    SELECT 1 FROM public.role_permissions
    WHERE role = user_role_val::user_role
    AND resource = resource_name
    AND action = action_name
    AND allowed = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create useful views for user management

-- Active users by role view
CREATE VIEW public.active_users_by_role AS
SELECT 
  role,
  COUNT(*) as user_count,
  ARRAY_AGG(full_name ORDER BY full_name) as user_names
FROM public.profiles
WHERE is_active = true
GROUP BY role
ORDER BY 
  CASE role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'teacher' THEN 3
    WHEN 'student' THEN 4
  END;

-- User activity view (last 30 days)
CREATE VIEW public.recent_user_activity AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.role,
  p.last_login_at,
  CASE 
    WHEN p.last_login_at >= NOW() - INTERVAL '7 days' THEN 'very_active'
    WHEN p.last_login_at >= NOW() - INTERVAL '30 days' THEN 'active'
    WHEN p.last_login_at >= NOW() - INTERVAL '90 days' THEN 'inactive'
    ELSE 'dormant'
  END as activity_status
FROM public.profiles p
WHERE p.is_active = true
ORDER BY p.last_login_at DESC NULLS LAST;

-- Department summary view
CREATE VIEW public.department_summary AS
SELECT 
  department,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_count,
  COUNT(*) FILTER (WHERE role = 'teacher') as teacher_count,
  COUNT(*) FILTER (WHERE role = 'student') as student_count,
  COUNT(*) FILTER (WHERE is_active = true) as active_users,
  COUNT(*) FILTER (WHERE last_login_at >= NOW() - INTERVAL '30 days') as recently_active
FROM public.profiles
WHERE department IS NOT NULL
GROUP BY department
ORDER BY total_users DESC;

-- Grant appropriate permissions to views
-- These views will inherit RLS policies from the base tables;
