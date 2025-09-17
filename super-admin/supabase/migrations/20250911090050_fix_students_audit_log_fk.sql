-- =============================================================================
-- Migration: Fix students audit log FK to allow hard deletes
-- Purpose  : Drop FK from students_audit_log.student_id so audit rows persist
--            after a student row is deleted (AFTER DELETE trigger inserts log
--            post-deletion which violates the FK).
-- =============================================================================

BEGIN;

-- Drop the foreign key that references public.students(id)
ALTER TABLE public.students_audit_log
  DROP CONSTRAINT IF EXISTS students_audit_log_student_id_fkey;

-- Clarify intent in schema documentation
COMMENT ON COLUMN public.students_audit_log.student_id IS
  'Logical reference to the student UUID for auditing only (no FK to allow DELETE logging).';

COMMIT;



