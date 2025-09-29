-- ============================================================================
-- Standalone Workshops Schema (no external FKs)
-- Creates public.workshops with validations, RLS, indexes, and completed view
-- ============================================================================

BEGIN;

-- 1) TABLE -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  overview TEXT NOT NULL,
  duration TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','completed','archived')),
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  syllabus JSONB NOT NULL DEFAULT '[]'::jsonb,
  materials JSONB NOT NULL DEFAULT '{"hardware":[],"software":[],"onlineResources":[]}'::jsonb,
  assessment JSONB NOT NULL DEFAULT '[]'::jsonb,
  learning_outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
  media JSONB NOT NULL DEFAULT '{"video":{"src":""},"photos":[]}'::jsonb,
  seo JSONB NOT NULL DEFAULT '{"title":"","description":""}'::jsonb,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.workshops IS 'Standalone workshops for completed projects (no external FKs)';
COMMENT ON COLUMN public.workshops.slug IS 'URL-friendly unique identifier for workshops';
COMMENT ON COLUMN public.workshops.status IS 'draft | completed | archived';
COMMENT ON COLUMN public.workshops.materials IS 'JSONB with hardware/software/onlineResources arrays';
COMMENT ON COLUMN public.workshops.media IS 'JSONB with video {src, poster?, caption?} and photos[]';
COMMENT ON COLUMN public.workshops.seo IS 'JSONB with SEO title and description';

-- 2) FUNCTIONS ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.validate_workshop_data()
RETURNS TRIGGER AS $$
DECLARE
  v_video_src TEXT;
BEGIN
  -- Required text fields non-empty (trim)
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    RAISE EXCEPTION 'slug is required';
  END IF;
  IF NEW.title IS NULL OR length(trim(NEW.title)) = 0 THEN
    RAISE EXCEPTION 'title is required';
  END IF;
  IF NEW.overview IS NULL OR length(trim(NEW.overview)) = 0 THEN
    RAISE EXCEPTION 'overview is required';
  END IF;
  IF NEW.duration IS NULL OR length(trim(NEW.duration)) = 0 THEN
    RAISE EXCEPTION 'duration is required';
  END IF;
  IF NEW.target_audience IS NULL OR length(trim(NEW.target_audience)) = 0 THEN
    RAISE EXCEPTION 'target_audience is required';
  END IF;
  IF NEW.source IS NULL OR length(trim(NEW.source)) = 0 THEN
    RAISE EXCEPTION 'source is required';
  END IF;

  -- Dates
  IF NEW.end_date <= NEW.start_date THEN
    RAISE EXCEPTION 'end_date must be after start_date';
  END IF;

  -- JSONB required array lengths
  IF jsonb_typeof(NEW.highlights) <> 'array' OR jsonb_array_length(NEW.highlights) < 1 THEN
    RAISE EXCEPTION 'highlights must contain at least 1 item';
  END IF;
  IF jsonb_typeof(NEW.syllabus) <> 'array' OR jsonb_array_length(NEW.syllabus) < 1 THEN
    RAISE EXCEPTION 'syllabus must contain at least 1 day';
  END IF;
  IF jsonb_typeof(NEW.assessment) <> 'array' OR jsonb_array_length(NEW.assessment) < 1 THEN
    RAISE EXCEPTION 'assessment must contain at least 1 item';
  END IF;
  IF jsonb_typeof(NEW.learning_outcomes) <> 'array' OR jsonb_array_length(NEW.learning_outcomes) < 1 THEN
    RAISE EXCEPTION 'learning_outcomes must contain at least 1 item';
  END IF;
  IF jsonb_typeof(NEW.materials->'hardware') <> 'array' OR jsonb_array_length(NEW.materials->'hardware') < 1 THEN
    RAISE EXCEPTION 'materials.hardware must contain at least 1 item';
  END IF;
  IF jsonb_typeof(NEW.materials->'software') <> 'array' OR jsonb_array_length(NEW.materials->'software') < 1 THEN
    RAISE EXCEPTION 'materials.software must contain at least 1 item';
  END IF;
  IF jsonb_typeof(NEW.materials->'onlineResources') <> 'array' OR jsonb_array_length(NEW.materials->'onlineResources') < 1 THEN
    RAISE EXCEPTION 'materials.onlineResources must contain at least 1 item';
  END IF;

  -- Media.video.src non-empty and looks like URL
  v_video_src := COALESCE(trim(NEW.media->'video'->>'src'), '');
  IF length(v_video_src) = 0 THEN
    RAISE EXCEPTION 'media.video.src is required';
  END IF;
  IF v_video_src !~* '^https?://[^\s]+$' THEN
    RAISE EXCEPTION 'media.video.src must be a valid URL';
  END IF;

  -- Photos must be an array with >= 1
  IF jsonb_typeof(NEW.media->'photos') <> 'array' OR jsonb_array_length(NEW.media->'photos') < 1 THEN
    RAISE EXCEPTION 'media.photos must contain at least 1 item';
  END IF;

  -- SEO non-empty
  IF length(trim(COALESCE(NEW.seo->>'title',''))) = 0 THEN
    RAISE EXCEPTION 'seo.title is required';
  END IF;
  IF length(trim(COALESCE(NEW.seo->>'description',''))) = 0 THEN
    RAISE EXCEPTION 'seo.description is required';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3) TRIGGERS ---------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_workshops_update_updated_at'
  ) THEN
    DROP TRIGGER trg_workshops_update_updated_at ON public.workshops;
  END IF;
END$$;

CREATE TRIGGER trg_workshops_update_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_workshops_validate'
  ) THEN
    DROP TRIGGER trg_workshops_validate ON public.workshops;
  END IF;
END$$;

CREATE TRIGGER trg_workshops_validate
  BEFORE INSERT OR UPDATE ON public.workshops
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_workshop_data();

-- 4) INDEXES ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_workshops_status ON public.workshops(status);
CREATE INDEX IF NOT EXISTS idx_workshops_start_date ON public.workshops(start_date);
CREATE INDEX IF NOT EXISTS idx_workshops_end_date ON public.workshops(end_date);
CREATE INDEX IF NOT EXISTS idx_workshops_created_at ON public.workshops(created_at);
CREATE INDEX IF NOT EXISTS idx_workshops_slug ON public.workshops(slug);

-- Fulltext indexes
CREATE INDEX IF NOT EXISTS idx_workshops_title_fts
  ON public.workshops USING gin (to_tsvector('english', COALESCE(title, '')));
CREATE INDEX IF NOT EXISTS idx_workshops_overview_fts
  ON public.workshops USING gin (to_tsvector('english', COALESCE(overview, '')));

-- 5) RLS --------------------------------------------------------------------
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='workshops' AND policyname='workshops_authenticated_all'
  ) THEN
    DROP POLICY "workshops_authenticated_all" ON public.workshops;
  END IF;
END$$;

CREATE POLICY "workshops_authenticated_all" ON public.workshops
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 6) VIEW -------------------------------------------------------------------
DROP VIEW IF EXISTS public.completed_workshops CASCADE;

CREATE VIEW public.completed_workshops AS
SELECT 
  id, slug, title, subtitle, overview, duration, target_audience,
  start_date, end_date, highlights, syllabus, materials,
  assessment, learning_outcomes, media, seo, source,
  created_at, updated_at
FROM public.workshops
WHERE status = 'completed'
ORDER BY end_date DESC;

-- set security properties (PG15+)
ALTER VIEW public.completed_workshops SET (security_invoker = true, security_barrier = true);

COMMENT ON VIEW public.completed_workshops IS 'Public subset of completed workshops for website display';

-- 7) GRANTS -----------------------------------------------------------------
GRANT SELECT ON public.completed_workshops TO anon;
GRANT SELECT ON public.completed_workshops TO authenticated;
GRANT ALL ON public.workshops TO authenticated;

COMMIT;


