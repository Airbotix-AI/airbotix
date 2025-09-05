-- Workshop Management Database Schema
-- Create workshops table with all required fields and constraints

-- Create workshops table
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  overview TEXT NOT NULL,
  duration TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'completed', 'archived')),
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  syllabus JSONB NOT NULL DEFAULT '[]'::jsonb,
  materials JSONB NOT NULL DEFAULT '{"hardware": [], "software": [], "onlineResources": []}'::jsonb,
  assessment JSONB NOT NULL DEFAULT '[]'::jsonb,
  learning_outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
  media JSONB NOT NULL DEFAULT '{"video": {"src": ""}, "photos": []}'::jsonb,
  seo JSONB NOT NULL DEFAULT '{"title": "", "description": ""}'::jsonb,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workshops_status ON workshops(status);
CREATE INDEX IF NOT EXISTS idx_workshops_start_date ON workshops(start_date);
CREATE INDEX IF NOT EXISTS idx_workshops_end_date ON workshops(end_date);
CREATE INDEX IF NOT EXISTS idx_workshops_created_at ON workshops(created_at);
CREATE INDEX IF NOT EXISTS idx_workshops_slug ON workshops(slug);
CREATE INDEX IF NOT EXISTS idx_workshops_title ON workshops USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_workshops_overview ON workshops USING gin(to_tsvector('english', overview));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_workshops_updated_at 
    BEFORE UPDATE ON workshops 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Super Admin can do everything
CREATE POLICY "Super Admin can do everything on workshops" ON workshops
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

-- Admin can manage workshops
CREATE POLICY "Admin can manage workshops" ON workshops
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Teachers can view assigned workshops (if needed in future)
CREATE POLICY "Teachers can view workshops" ON workshops
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'teacher'
    )
  );

-- Grant permissions
GRANT ALL ON workshops TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE workshops IS 'Workshop management table with comprehensive content and media support';
COMMENT ON COLUMN workshops.slug IS 'URL-friendly identifier for workshops';
COMMENT ON COLUMN workshops.highlights IS 'Array of workshop highlights';
COMMENT ON COLUMN workshops.syllabus IS 'Array of syllabus days with objectives and activities';
COMMENT ON COLUMN workshops.materials IS 'Object containing hardware, software, and online resources';
COMMENT ON COLUMN workshops.assessment IS 'Array of assessment items with weights and criteria';
COMMENT ON COLUMN workshops.learning_outcomes IS 'Array of learning outcomes';
COMMENT ON COLUMN workshops.media IS 'Object containing video and photos';
COMMENT ON COLUMN workshops.seo IS 'Object containing SEO title and description';
COMMENT ON COLUMN workshops.source IS 'Source information for tracking workshop origin';

-- Create a view for completed workshops (for main website)
CREATE OR REPLACE VIEW completed_workshops AS
SELECT 
  id,
  slug,
  title,
  subtitle,
  overview,
  duration,
  target_audience,
  start_date,
  end_date,
  highlights,
  syllabus,
  materials,
  assessment,
  learning_outcomes,
  media,
  seo,
  source,
  created_at,
  updated_at
FROM workshops 
WHERE status = 'completed'
ORDER BY end_date DESC;

-- Grant access to the view
GRANT SELECT ON completed_workshops TO authenticated;
GRANT SELECT ON completed_workshops TO anon;

-- Create a function to validate workshop data
CREATE OR REPLACE FUNCTION validate_workshop_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate required fields
  IF NEW.title IS NULL OR LENGTH(TRIM(NEW.title)) < 3 THEN
    RAISE EXCEPTION 'Title must be at least 3 characters long';
  END IF;
  
  IF NEW.overview IS NULL OR LENGTH(TRIM(NEW.overview)) < 10 THEN
    RAISE EXCEPTION 'Overview must be at least 10 characters long';
  END IF;
  
  IF NEW.duration IS NULL OR LENGTH(TRIM(NEW.duration)) < 3 THEN
    RAISE EXCEPTION 'Duration is required';
  END IF;
  
  IF NEW.target_audience IS NULL OR LENGTH(TRIM(NEW.target_audience)) < 5 THEN
    RAISE EXCEPTION 'Target audience is required';
  END IF;
  
  IF NEW.end_date <= NEW.start_date THEN
    RAISE EXCEPTION 'End date must be after start date';
  END IF;
  
  IF NEW.source IS NULL OR LENGTH(TRIM(NEW.source)) < 3 THEN
    RAISE EXCEPTION 'Source is required';
  END IF;
  
  -- Validate JSONB fields
  IF jsonb_array_length(NEW.highlights) = 0 THEN
    RAISE EXCEPTION 'At least one highlight is required';
  END IF;
  
  IF jsonb_array_length(NEW.syllabus) = 0 THEN
    RAISE EXCEPTION 'At least one syllabus day is required';
  END IF;
  
  IF jsonb_array_length(NEW.materials->'hardware') = 0 THEN
    RAISE EXCEPTION 'At least one hardware item is required';
  END IF;
  
  IF jsonb_array_length(NEW.materials->'software') = 0 THEN
    RAISE EXCEPTION 'At least one software item is required';
  END IF;
  
  IF jsonb_array_length(NEW.materials->'onlineResources') = 0 THEN
    RAISE EXCEPTION 'At least one online resource is required';
  END IF;
  
  IF jsonb_array_length(NEW.assessment) = 0 THEN
    RAISE EXCEPTION 'At least one assessment item is required';
  END IF;
  
  IF jsonb_array_length(NEW.learning_outcomes) = 0 THEN
    RAISE EXCEPTION 'At least one learning outcome is required';
  END IF;
  
  IF NEW.media->'video'->>'src' IS NULL OR LENGTH(TRIM(NEW.media->'video'->>'src')) = 0 THEN
    RAISE EXCEPTION 'Video is required';
  END IF;
  
  IF jsonb_array_length(NEW.media->'photos') = 0 THEN
    RAISE EXCEPTION 'At least one photo is required';
  END IF;
  
  IF NEW.seo->>'title' IS NULL OR LENGTH(TRIM(NEW.seo->>'title')) < 10 THEN
    RAISE EXCEPTION 'SEO title must be at least 10 characters long';
  END IF;
  
  IF NEW.seo->>'description' IS NULL OR LENGTH(TRIM(NEW.seo->>'description')) < 20 THEN
    RAISE EXCEPTION 'SEO description must be at least 20 characters long';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
CREATE TRIGGER validate_workshop_data_trigger
  BEFORE INSERT OR UPDATE ON workshops
  FOR EACH ROW
  EXECUTE FUNCTION validate_workshop_data();
