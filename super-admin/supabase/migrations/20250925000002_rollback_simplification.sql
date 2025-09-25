-- ============================================================================
-- ROLLBACK MIGRATION FOR DATABASE SIMPLIFICATION
-- ============================================================================
-- This migration provides a way to rollback the database simplification
-- in case issues are discovered after deployment.
--
-- WARNING: This rollback will recreate the complex structure but 
-- will NOT restore any data that was deleted in the simplification.
-- ============================================================================

-- This migration should only be applied if rollback is needed
-- Uncomment the sections below to perform rollback

/*

-- ============================================================================
-- 1. RECREATE WORKSHOP STATUS ENUM
-- ============================================================================

CREATE TYPE workshop_status AS ENUM ('draft', 'completed', 'archived', 'scheduled', 'cancelled');

-- ============================================================================
-- 2. RECREATE COURSES TABLE
-- ============================================================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  age_group_min INTEGER NOT NULL,
  age_group_max INTEGER NOT NULL,
  session_count INTEGER NOT NULL DEFAULT 1,
  skill_level_required VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- 3. RECREATE WORKSHOPS TABLE
-- ============================================================================

CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  overview TEXT,
  duration TEXT,
  target_audience TEXT,
  start_date DATE,
  end_date DATE,
  scheduled_date TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 90,
  status workshop_status NOT NULL DEFAULT 'scheduled',
  highlights JSONB DEFAULT '[]',
  syllabus JSONB DEFAULT '[]',
  materials JSONB DEFAULT '{"hardware":[],"software":[],"onlineResources":[]}',
  assessment JSONB DEFAULT '[]',
  learning_outcomes JSONB DEFAULT '[]',
  media JSONB DEFAULT '{"video":null,"photos":[]}',
  seo JSONB DEFAULT '{"title":"","description":""}',
  source TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id),
  location VARCHAR(255),
  max_capacity INTEGER DEFAULT 20,
  current_enrollment INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- 4. RECREATE ENROLLMENTS TABLE  
-- ============================================================================

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN DEFAULT false,
  attendance_marked_at TIMESTAMPTZ,
  attendance_marked_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(student_id, workshop_id)
);

-- ============================================================================
-- 5. RECREATE AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE workshops_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_fields TEXT[],
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. ENABLE RLS ON RECREATED TABLES
-- ============================================================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops_audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. RECREATE ESSENTIAL RLS POLICIES
-- ============================================================================

-- Course policies
CREATE POLICY "super_admin_courses_full" ON courses FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'));

CREATE POLICY "admin_courses_full" ON courses FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Workshop policies  
CREATE POLICY "super_admin_workshops_full" ON workshops FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'));

CREATE POLICY "admin_workshops_full" ON workshops FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Enrollment policies
CREATE POLICY "super_admin_enrollments_full" ON enrollments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'));

-- ============================================================================
-- 8. RECREATE BASIC INDEXES
-- ============================================================================

CREATE INDEX idx_courses_active ON courses(is_active);
CREATE INDEX idx_workshops_status ON workshops(status);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_workshop ON enrollments(workshop_id);

-- ============================================================================
-- 9. RECREATE ROLE PERMISSIONS
-- ============================================================================

INSERT INTO public.role_permissions (role, resource, action, allowed) VALUES
  -- Workshop permissions
  ('super_admin', 'workshops', 'create', true),
  ('super_admin', 'workshops', 'read', true),
  ('super_admin', 'workshops', 'update', true),
  ('super_admin', 'workshops', 'delete', true),
  ('admin', 'workshops', 'create', true),
  ('admin', 'workshops', 'read', true),
  ('admin', 'workshops', 'update', true),
  ('admin', 'workshops', 'delete', true),
  ('teacher', 'workshops', 'read', true),
  
  -- Course permissions
  ('super_admin', 'courses', 'create', true),
  ('super_admin', 'courses', 'read', true),
  ('super_admin', 'courses', 'update', true),
  ('super_admin', 'courses', 'delete', true),
  ('admin', 'courses', 'create', true),
  ('admin', 'courses', 'read', true),
  ('admin', 'courses', 'update', true),
  ('admin', 'courses', 'delete', true),
  ('teacher', 'courses', 'read', true)
ON CONFLICT (role, resource, action) DO NOTHING;

-- Log the rollback
SELECT public.log_security_event(
  'database_simplification_rollback',
  'migration',
  NULL,
  json_build_object(
    'recreated_tables', ARRAY['courses', 'workshops', 'enrollments', 'workshops_audit_log'],
    'rollback_date', NOW(),
    'warning', 'Data from before simplification was not restored'
  )
);

*/

-- ============================================================================
-- ROLLBACK INSTRUCTIONS
-- ============================================================================

-- To perform the rollback:
-- 1. Uncomment all sections above (remove /* and */)
-- 2. Apply this migration
-- 3. Note that any data deleted during simplification will NOT be restored
-- 4. You may need to manually recreate complex functions and triggers
-- 5. Test thoroughly before using in production

SELECT 'Rollback migration created but commented out. Uncomment sections to apply rollback.' as status;
