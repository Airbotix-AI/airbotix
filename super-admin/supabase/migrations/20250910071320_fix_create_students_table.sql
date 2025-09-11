-- Students table migration
-- Creates comprehensive students table with proper constraints, indexes, and RLS policies

-- Create enum types for better data integrity
CREATE TYPE student_skill_level AS ENUM (
  'beginner',
  'intermediate', 
  'advanced'
);

CREATE TYPE student_status AS ENUM (
  'active',
  'inactive',
  'suspended',
  'graduated'
);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personal Information
  full_name VARCHAR(255) NOT NULL CHECK (length(trim(full_name)) >= 2),
  date_of_birth DATE NOT NULL CHECK (
    date_of_birth >= CURRENT_DATE - INTERVAL '18 years' AND 
    date_of_birth <= CURRENT_DATE - INTERVAL '5 years'
  ),
  school_name VARCHAR(255) NOT NULL CHECK (length(trim(school_name)) >= 2),
  grade_level VARCHAR(10) NOT NULL CHECK (grade_level ~ '^(K|[1-9]|1[0-2])$'),
  
  -- Contact Information  
  parent_email VARCHAR(255) NOT NULL CHECK (parent_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  parent_phone VARCHAR(20) NOT NULL CHECK (parent_phone ~ '^\+?[1-9]\d{1,14}$'),
  emergency_contact_name VARCHAR(255) CHECK (
    emergency_contact_name IS NULL OR length(trim(emergency_contact_name)) >= 2
  ),
  emergency_contact_phone VARCHAR(20) CHECK (
    emergency_contact_phone IS NULL OR emergency_contact_phone ~ '^\+?[1-9]\d{1,14}$'
  ),
  
  -- Program Information
  skill_level student_skill_level NOT NULL DEFAULT 'beginner',
  status student_status NOT NULL DEFAULT 'active',
  special_requirements TEXT CHECK (
    special_requirements IS NULL OR length(trim(special_requirements)) <= 1000
  ),
  medical_notes TEXT CHECK (
    medical_notes IS NULL OR length(trim(medical_notes)) <= 1000
  ),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add table comments for documentation
COMMENT ON TABLE public.students IS 'Student information and enrollment data for workshop management system';

-- Add column comments
COMMENT ON COLUMN public.students.id IS 'Unique identifier for the student';
COMMENT ON COLUMN public.students.full_name IS 'Student full legal name';
COMMENT ON COLUMN public.students.date_of_birth IS 'Student date of birth (age validation: 5-18 years)';
COMMENT ON COLUMN public.students.school_name IS 'Name of the school the student attends';
COMMENT ON COLUMN public.students.grade_level IS 'Student grade level (K, 1-12)';
COMMENT ON COLUMN public.students.parent_email IS 'Primary parent/guardian email address';
COMMENT ON COLUMN public.students.parent_phone IS 'Primary parent/guardian phone number';
COMMENT ON COLUMN public.students.emergency_contact_name IS 'Emergency contact person name';
COMMENT ON COLUMN public.students.emergency_contact_phone IS 'Emergency contact phone number';
COMMENT ON COLUMN public.students.skill_level IS 'Student programming/robotics skill level';
COMMENT ON COLUMN public.students.status IS 'Current enrollment status';
COMMENT ON COLUMN public.students.special_requirements IS 'Any special accommodations or requirements';
COMMENT ON COLUMN public.students.medical_notes IS 'Important medical information for instructors';
COMMENT ON COLUMN public.students.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN public.students.updated_at IS 'Record last update timestamp';
COMMENT ON COLUMN public.students.created_by IS 'User who created this record';
COMMENT ON COLUMN public.students.updated_by IS 'User who last updated this record';

-- Create indexes for performance optimization
CREATE INDEX idx_students_full_name ON public.students USING gin(to_tsvector('english', full_name));
CREATE INDEX idx_students_parent_email ON public.students (parent_email);
CREATE INDEX idx_students_school_name ON public.students (school_name);
CREATE INDEX idx_students_status ON public.students (status);
CREATE INDEX idx_students_skill_level ON public.students (skill_level);
CREATE INDEX idx_students_grade_level ON public.students (grade_level);
CREATE INDEX idx_students_created_at ON public.students (created_at DESC);
CREATE INDEX idx_students_updated_at ON public.students (updated_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_students_status_skill_level ON public.students (status, skill_level);
CREATE INDEX idx_students_school_grade ON public.students (school_name, grade_level);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_students_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER trigger_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_students_updated_at();

-- Create function to automatically set created_by
CREATE OR REPLACE FUNCTION public.set_students_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic created_by setting
CREATE TRIGGER trigger_students_created_by
  BEFORE INSERT ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.set_students_created_by();

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Super admins have full access to all student records
CREATE POLICY "super_admins_full_access_students" ON public.students
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Admins can read and write all student records
CREATE POLICY "admins_read_write_access_students" ON public.students
  FOR ALL
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

-- Teachers can only read student records (no create/update/delete)
CREATE POLICY "teachers_read_access_students" ON public.students
  FOR SELECT
  USING (public.get_user_role() = 'teacher');

-- Create audit log table for tracking changes
CREATE TABLE public.students_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments to audit log
COMMENT ON TABLE public.students_audit_log IS 'Audit log for tracking all changes to student records';

-- Create indexes for audit log
CREATE INDEX idx_students_audit_log_student_id ON public.students_audit_log (student_id);
CREATE INDEX idx_students_audit_log_changed_at ON public.students_audit_log (changed_at DESC);
CREATE INDEX idx_students_audit_log_action ON public.students_audit_log (action);

-- Enable RLS on audit log
ALTER TABLE public.students_audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log policies (only admins and super admins can read audit logs)
CREATE POLICY "admins_read_students_audit_log" ON public.students_audit_log
  FOR SELECT
  USING (public.is_admin_or_above());

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.students_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.students_audit_log (student_id, action, old_values, changed_by)
    VALUES (OLD.id, 'DELETE', row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.students_audit_log (student_id, action, old_values, new_values, changed_by)
    VALUES (NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.students_audit_log (student_id, action, new_values, changed_by)
    VALUES (NEW.id, 'INSERT', row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers
CREATE TRIGGER trigger_students_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.students_audit_trigger();

-- Create useful views for common queries

-- Active students view
CREATE VIEW public.active_students AS
SELECT 
  id,
  full_name,
  date_of_birth,
  school_name,
  grade_level,
  parent_email,
  parent_phone,
  skill_level,
  created_at
FROM public.students
WHERE status = 'active';

-- Students by skill level view
CREATE VIEW public.students_by_skill_level AS
SELECT 
  skill_level,
  COUNT(*) as student_count,
  ARRAY_AGG(full_name ORDER BY full_name) as student_names
FROM public.students
WHERE status = 'active'
GROUP BY skill_level;

-- Students by school view
CREATE VIEW public.students_by_school AS
SELECT 
  school_name,
  COUNT(*) as student_count,
  ARRAY_AGG(DISTINCT grade_level ORDER BY grade_level) as grade_levels
FROM public.students
WHERE status = 'active'
GROUP BY school_name
ORDER BY student_count DESC;