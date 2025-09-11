-- Add parent_name to students table
-- Ensures parent/guardian name is stored and required for students (esp. under 12)

BEGIN;

-- 1) Add column with a temporary default to backfill existing rows
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS parent_name VARCHAR(255) DEFAULT 'Parent/Guardian';

-- 2) Add length check constraint (min 2 chars when not null)
ALTER TABLE public.students
  ADD CONSTRAINT chk_students_parent_name_length
  CHECK (parent_name IS NULL OR length(trim(parent_name)) >= 2);

-- 3) Backfill any existing NULLs to the temporary default
UPDATE public.students
SET parent_name = COALESCE(parent_name, 'Parent/Guardian')
WHERE parent_name IS NULL;

-- 4) Make the column NOT NULL and drop the default for future inserts
ALTER TABLE public.students
  ALTER COLUMN parent_name SET NOT NULL,
  ALTER COLUMN parent_name DROP DEFAULT;

-- 5) Documentation
COMMENT ON COLUMN public.students.parent_name IS 'Primary parent/guardian full name';

COMMIT;


