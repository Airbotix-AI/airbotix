-- Create courses, workshops, and enrollment relationships migration
-- This migration supports both scheduled workshops (student management) and completed workshops (Super Admin system)

-- ============================================================================
-- COURSES TABLE
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
-- WORKSHOP STATUS ENUM
-- ============================================================================

CREATE TYPE workshop_status AS ENUM ('draft', 'completed', 'archived', 'scheduled', 'cancelled');

-- ============================================================================
-- WORKSHOPS TABLE (UNIFIED)
-- ============================================================================

CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  
  -- Basic Information (required for completed workshops)
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  overview TEXT,
  duration TEXT, -- For completed: duration description, For scheduled: duration_minutes used instead
  target_audience TEXT,
  
  -- Time & Status
  start_date DATE, -- For completed workshops
  end_date DATE,   -- For completed workshops
  scheduled_date TIMESTAMPTZ, -- For scheduled workshops
  duration_minutes INTEGER DEFAULT 90, -- For scheduled workshops
  status workshop_status NOT NULL DEFAULT 'scheduled',
  
  -- Completed Workshop Content (Super Admin system fields)
  highlights JSONB DEFAULT '[]',
  syllabus JSONB DEFAULT '[]',
  materials JSONB DEFAULT '{"hardware":[],"software":[],"onlineResources":[]}',
  assessment JSONB DEFAULT '[]',
  learning_outcomes JSONB DEFAULT '[]',
  media JSONB DEFAULT '{"video":null,"photos":[]}',
  seo JSONB DEFAULT '{"title":"","description":""}',
  source TEXT, -- Required for completed workshops
  
  -- Scheduled Workshop Fields (Student Management system)
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id),
  location VARCHAR(255),
  max_capacity INTEGER DEFAULT 20,
  current_enrollment INTEGER DEFAULT 0,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Constraints based on workshop type
  CONSTRAINT valid_completed_workshop CHECK (
    (status IN ('completed', 'archived') AND 
     title IS NOT NULL AND 
     overview IS NOT NULL AND 
     duration IS NOT NULL AND
     target_audience IS NOT NULL AND
     start_date IS NOT NULL AND
     end_date IS NOT NULL AND
     source IS NOT NULL AND
     end_date >= start_date AND
     jsonb_array_length(highlights) >= 1 AND
     jsonb_array_length(syllabus) >= 1 AND
     jsonb_array_length(assessment) >= 1 AND
     jsonb_array_length(learning_outcomes) >= 1 AND
     jsonb_typeof(materials->'hardware') = 'array' AND
     jsonb_typeof(materials->'software') = 'array' AND  
     jsonb_typeof(materials->'onlineResources') = 'array' AND
     jsonb_array_length(materials->'hardware') >= 1 AND
     jsonb_array_length(materials->'software') >= 1 AND
     jsonb_array_length(materials->'onlineResources') >= 1 AND
     media->'video' IS NOT NULL AND
     jsonb_typeof(media->'photos') = 'array' AND
     jsonb_array_length(media->'photos') >= 1 AND
     length(seo->>'title') > 0 AND
     length(seo->>'description') > 0)
    OR status IN ('draft', 'scheduled', 'cancelled')
  ),
  CONSTRAINT valid_scheduled_workshop CHECK (
    (status IN ('scheduled', 'cancelled') AND
     scheduled_date IS NOT NULL AND
     duration_minutes > 0 AND
     max_capacity > 0)
    OR status IN ('draft', 'completed', 'archived')
  )
);

-- ============================================================================
-- ENROLLMENTS TABLE
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
-- WORKSHOP AUDIT LOG TABLE
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
-- PERFORMANCE INDEXES
-- ============================================================================

-- Course indexes
CREATE INDEX idx_courses_active ON courses(is_active);
CREATE INDEX idx_courses_skill_level ON courses(skill_level_required);
CREATE INDEX idx_courses_age_group ON courses(age_group_min, age_group_max);

-- Workshop indexes
CREATE INDEX idx_workshops_status ON workshops(status);
CREATE INDEX idx_workshops_scheduled_date ON workshops(scheduled_date);
CREATE INDEX idx_workshops_start_date ON workshops(start_date DESC);
CREATE INDEX idx_workshops_course_id ON workshops(course_id);
CREATE INDEX idx_workshops_instructor_id ON workshops(instructor_id);
CREATE INDEX idx_workshops_slug ON workshops(slug);

-- Full-text search for completed workshops
CREATE INDEX idx_workshops_search ON workshops USING gin(
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(overview, '') || ' ' || COALESCE(target_audience, ''))
) WHERE status IN ('completed', 'archived');

-- Enrollment indexes
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_workshop ON enrollments(workshop_id);
CREATE INDEX idx_enrollments_attended ON enrollments(attended);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Auto-generate slug for completed workshops
CREATE OR REPLACE FUNCTION generate_workshop_slug(workshop_title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(workshop_title, '[^a-zA-Z0-9\s]', '', 'g'), 
    '\s+', '-', 'g'
  ));
END;
$$ LANGUAGE plpgsql;

-- Update enrollment count
CREATE OR REPLACE FUNCTION update_workshop_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE workshops 
    SET current_enrollment = (
      SELECT COUNT(*) FROM enrollments WHERE workshop_id = NEW.workshop_id
    )
    WHERE id = NEW.workshop_id;
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE workshops 
    SET current_enrollment = (
      SELECT COUNT(*) FROM enrollments WHERE workshop_id = OLD.workshop_id
    )
    WHERE id = OLD.workshop_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Validate enrollment is only for scheduled workshops
CREATE OR REPLACE FUNCTION validate_enrollment_workshop_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if workshop exists and has scheduled status
  IF NOT EXISTS (
    SELECT 1 FROM workshops 
    WHERE id = NEW.workshop_id AND status = 'scheduled'
  ) THEN
    RAISE EXCEPTION 'Enrollment is only allowed for workshops with scheduled status';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update timestamps and user tracking
CREATE OR REPLACE FUNCTION update_workshop_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  
  -- Auto-generate slug for completed workshops
  IF NEW.status IN ('completed', 'archived') AND (NEW.slug IS NULL OR NEW.slug = '') THEN
    NEW.slug = generate_workshop_slug(NEW.title);
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM workshops WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      NEW.slug = NEW.slug || '-' || extract(epoch from now())::bigint;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workshops_update_timestamp
  BEFORE UPDATE ON workshops
  FOR EACH ROW
  EXECUTE FUNCTION update_workshop_timestamps();

-- Enrollment count trigger
CREATE TRIGGER update_enrollment_count
  AFTER INSERT OR DELETE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_workshop_enrollment_count();

-- Enrollment validation trigger
CREATE TRIGGER validate_enrollment_workshop
  BEFORE INSERT OR UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION validate_enrollment_workshop_status();

-- Audit trigger
CREATE OR REPLACE FUNCTION log_workshop_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO workshops_audit_log (workshop_id, action, new_values, performed_by)
    VALUES (NEW.id, 'created', to_jsonb(NEW), auth.uid());
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO workshops_audit_log (workshop_id, action, old_values, new_values, performed_by)
    VALUES (NEW.id, 'updated', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    INSERT INTO workshops_audit_log (workshop_id, action, old_values, performed_by)
    VALUES (OLD.id, 'deleted', to_jsonb(OLD), auth.uid());
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workshops_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON workshops
  FOR EACH ROW
  EXECUTE FUNCTION log_workshop_changes();

-- ============================================================================
-- UTILITY VIEWS
-- ============================================================================

-- Completed workshops for main website
CREATE VIEW completed_workshops AS
SELECT 
  id, slug, title, subtitle, overview, duration, target_audience,
  start_date, end_date, highlights, syllabus, materials,
  assessment, learning_outcomes, media, seo, source
FROM workshops 
WHERE status = 'completed'
ORDER BY end_date DESC;

-- Scheduled workshops for student management
CREATE VIEW scheduled_workshops AS
SELECT 
  id, title, course_id, instructor_id, scheduled_date, 
  duration_minutes, location, max_capacity, current_enrollment, status
FROM workshops 
WHERE status = 'scheduled'
ORDER BY scheduled_date ASC;

-- Workshop enrollment summary
CREATE VIEW workshop_enrollment_summary AS
SELECT 
  w.id,
  w.title,
  w.max_capacity,
  w.current_enrollment,
  (w.max_capacity - w.current_enrollment) as available_spots,
  CASE 
    WHEN w.current_enrollment >= w.max_capacity THEN 'full'
    WHEN w.current_enrollment >= w.max_capacity * 0.8 THEN 'almost_full'
    ELSE 'available'
  END as enrollment_status
FROM workshops w
WHERE w.status = 'scheduled';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops_audit_log ENABLE ROW LEVEL SECURITY;

-- Course policies
CREATE POLICY "super_admin_courses_full" ON courses FOR ALL 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'));

CREATE POLICY "admin_courses_full" ON courses FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "teacher_courses_read" ON courses FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'));

-- Workshop policies  
CREATE POLICY "super_admin_workshops_full" ON workshops FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'));

CREATE POLICY "admin_workshops_full" ON workshops FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "teacher_workshops_assigned" ON workshops FOR SELECT
  USING (
    instructor_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
  );

-- Public read for completed workshops (main website)
CREATE POLICY "public_completed_workshops" ON workshops FOR SELECT
  USING (status = 'completed');

-- Enrollment policies
CREATE POLICY "super_admin_enrollments_full" ON enrollments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'));

CREATE POLICY "admin_enrollments_full" ON enrollments FOR ALL  
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "teacher_enrollments_assigned" ON enrollments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workshops w 
      WHERE w.id = enrollments.workshop_id AND w.instructor_id = auth.uid()
    )
  );

-- Audit policies
CREATE POLICY "super_admin_audit_full" ON workshops_audit_log FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'));

CREATE POLICY "admin_audit_read" ON workshops_audit_log FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================================
-- TABLE AND COLUMN COMMENTS
-- ============================================================================

COMMENT ON TABLE courses IS 'Course catalog for organizing workshops by curriculum and skill level';
COMMENT ON TABLE workshops IS 'Unified workshops table supporting both scheduled workshops (student management) and completed workshops (Super Admin management)';
COMMENT ON TABLE enrollments IS 'Student enrollment records for scheduled workshops with attendance tracking';
COMMENT ON TABLE workshops_audit_log IS 'Audit trail for all workshop changes and administrative actions';

-- Workshop column comments
COMMENT ON COLUMN workshops.status IS 'Workshop status: draft/completed/archived (Super Admin), scheduled/cancelled (Student Management)';
COMMENT ON COLUMN workshops.highlights IS 'Required for completed workshops - minimum 1 item';
COMMENT ON COLUMN workshops.syllabus IS 'Required for completed workshops - minimum 1 day';
COMMENT ON COLUMN workshops.materials IS 'Required for completed workshops - each category minimum 1 item';
COMMENT ON COLUMN workshops.assessment IS 'Required for completed workshops - minimum 1 item';
COMMENT ON COLUMN workshops.learning_outcomes IS 'Required for completed workshops - minimum 1 item';
COMMENT ON COLUMN workshops.media IS 'Required for completed workshops - minimum 1 video and 1 photo';
COMMENT ON COLUMN workshops.seo IS 'Required for completed workshops - title and description';
COMMENT ON COLUMN workshops.source IS 'Required for completed workshops - source tracking';
COMMENT ON COLUMN workshops.slug IS 'URL-friendly identifier auto-generated for completed workshops';
COMMENT ON COLUMN workshops.duration IS 'Human-readable duration description for completed workshops';
COMMENT ON COLUMN workshops.duration_minutes IS 'Numeric duration in minutes for scheduled workshops';
COMMENT ON COLUMN workshops.scheduled_date IS 'Date and time for scheduled workshops';
COMMENT ON COLUMN workshops.start_date IS 'Start date for completed workshops';
COMMENT ON COLUMN workshops.end_date IS 'End date for completed workshops';
COMMENT ON COLUMN workshops.max_capacity IS 'Maximum number of students for scheduled workshops';
COMMENT ON COLUMN workshops.current_enrollment IS 'Current enrollment count, automatically updated via triggers';

-- Course column comments
COMMENT ON COLUMN courses.age_group_min IS 'Minimum age for course participation';
COMMENT ON COLUMN courses.age_group_max IS 'Maximum age for course participation';
COMMENT ON COLUMN courses.session_count IS 'Number of sessions in this course';
COMMENT ON COLUMN courses.skill_level_required IS 'Required skill level: beginner, intermediate, advanced';

-- Enrollment column comments
COMMENT ON COLUMN enrollments.attended IS 'Whether student attended the workshop';
COMMENT ON COLUMN enrollments.attendance_marked_at IS 'When attendance was recorded';
COMMENT ON COLUMN enrollments.attendance_marked_by IS 'Who recorded the attendance';
