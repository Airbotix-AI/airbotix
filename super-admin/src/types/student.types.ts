/**
 * Student Management TypeScript Type Definitions
 * 
 * Comprehensive type definitions matching the Supabase database schema exactly.
 * All types are explicit interfaces with no 'any' types used.
 * Uses string constants instead of literals for better maintainability.
 * 
 * Database Schema Reference:
 * - students table: /super-admin/supabase/migrations/20250910071320_fix_create_students_table.sql
 * - user_profiles table: /super-admin/supabase/migrations/20250910063129_create_user_profiles_and_roles.sql
 * - courses/workshops/enrollments: /super-admin/supabase/migrations/20250910120007_create_courses_workshops_enrollments.sql
 * 
 * @file student.types.ts
 * @version 1.0.0
 */

// ============================================================================
// ENUM TYPES FROM DATABASE
// ============================================================================

/**
 * Student skill level enum from database: student_skill_level
 */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Student status enum from database: student_status
 * Note: 'suspended' added from database schema
 */
export type StudentStatus = 'active' | 'inactive' | 'suspended' | 'graduated';

/**
 * User role enum from database: user_role
 */
export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student';

/**
 * Workshop status enum from database: workshop_status
 */
export type WorkshopStatus = 'draft' | 'completed' | 'archived' | 'scheduled' | 'cancelled';

/**
 * Grade level type - validates K-12 format from database check constraint
 */
export type GradeLevel = 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

// ============================================================================
// DATABASE ENTITY TYPES
// ============================================================================

/**
 * Student entity matching the database table exactly
 * Table: public.students
 */
export interface Student {
  id: string;
  full_name: string;
  date_of_birth: string; // ISO date string from database DATE type
  school_name: string;
  grade_level: string; // K-12 format validated by database constraint
  parent_email: string;
  parent_phone: string;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  skill_level: SkillLevel;
  status: StudentStatus;
  special_requirements?: string | null;
  medical_notes?: string | null;
  created_at: string; // ISO timestamp string from database TIMESTAMPTZ
  updated_at: string; // ISO timestamp string from database TIMESTAMPTZ
  created_by?: string | null; // UUID reference to auth.users(id)
  updated_by?: string | null; // UUID reference to auth.users(id)
}

/**
 * User profile entity matching the database table exactly
 * Table: public.profiles
 */
export interface UserProfile {
  id: string; // UUID reference to auth.users(id)
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  avatar_url?: string | null;
  department?: string | null;
  employee_id?: string | null;
  is_active: boolean;
  last_login_at?: string | null; // ISO timestamp string from database TIMESTAMPTZ
  password_changed_at?: string | null; // ISO timestamp string from database TIMESTAMPTZ
  created_at: string; // ISO timestamp string from database TIMESTAMPTZ
  updated_at: string; // ISO timestamp string from database TIMESTAMPTZ
}

/**
 * Course entity matching the database table exactly
 * Table: public.courses
 */
export interface Course {
  id: string;
  name: string;
  description?: string | null;
  age_group_min: number;
  age_group_max: number;
  session_count: number;
  skill_level_required: string; // Maps to SkillLevel values
  is_active: boolean;
  created_at: string; // ISO timestamp string from database TIMESTAMPTZ
  updated_at: string; // ISO timestamp string from database TIMESTAMPTZ
  created_by?: string | null; // UUID reference to auth.users(id)
}

/**
 * Workshop entity matching the unified database table exactly
 * Table: public.workshops (supports both scheduled and completed workshops)
 */
export interface Workshop {
  id: string;
  slug?: string | null;
  title: string;
  subtitle?: string | null;
  overview?: string | null;
  duration?: string | null; // For completed workshops - human readable
  target_audience?: string | null;
  start_date?: string | null; // ISO date string for completed workshops
  end_date?: string | null; // ISO date string for completed workshops
  scheduled_date?: string | null; // ISO timestamp string for scheduled workshops
  duration_minutes: number; // For scheduled workshops
  status: WorkshopStatus;
  highlights: unknown; // JSONB - workshop highlights array
  syllabus: unknown; // JSONB - syllabus structure
  materials: unknown; // JSONB - materials object with hardware/software/resources
  assessment: unknown; // JSONB - assessment criteria array
  learning_outcomes: unknown; // JSONB - learning outcomes array
  media: unknown; // JSONB - media object with video/photos
  seo: unknown; // JSONB - SEO object with title/description
  source?: string | null; // Required for completed workshops
  course_id?: string | null; // UUID reference for scheduled workshops
  instructor_id?: string | null; // UUID reference to profiles(id)
  location?: string | null;
  max_capacity: number;
  current_enrollment: number;
  created_at: string; // ISO timestamp string from database TIMESTAMPTZ
  updated_at: string; // ISO timestamp string from database TIMESTAMPTZ
  created_by?: string | null; // UUID reference to auth.users(id)
  updated_by?: string | null; // UUID reference to auth.users(id)
}

/**
 * Enrollment entity matching the database table exactly
 * Table: public.enrollments
 */
export interface Enrollment {
  id: string;
  student_id: string; // UUID reference to students(id)
  workshop_id: string; // UUID reference to workshops(id)
  enrolled_at: string; // ISO timestamp string from database TIMESTAMPTZ
  attended: boolean;
  attendance_marked_at?: string | null; // ISO timestamp string from database TIMESTAMPTZ
  attendance_marked_by?: string | null; // UUID reference to auth.users(id)
  notes?: string | null;
}

/**
 * Students audit log entity matching the database table exactly
 * Table: public.students_audit_log
 */
export interface StudentsAuditLog {
  id: string;
  student_id: string; // UUID reference to students(id)
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values?: unknown | null; // JSONB - previous record state
  new_values?: unknown | null; // JSONB - updated record state
  changed_by?: string | null; // UUID reference to auth.users(id)
  changed_at: string; // ISO timestamp string from database TIMESTAMPTZ
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

/**
 * Student form data for create/update operations
 * Excludes auto-generated fields (id, timestamps, audit fields)
 */
export interface StudentFormData {
  full_name: string;
  date_of_birth: string; // ISO date string (YYYY-MM-DD)
  school_name: string;
  grade_level: string; // K-12 format
  parent_email: string;
  parent_phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  skill_level: SkillLevel;
  special_requirements?: string;
  medical_notes?: string;
}

/**
 * Course form data for create/update operations
 * Excludes auto-generated fields (id, timestamps, audit fields)
 */
export interface CourseFormData {
  name: string;
  description?: string;
  age_group_min: number;
  age_group_max: number;
  session_count: number;
  skill_level_required: SkillLevel;
  is_active: boolean;
}

/**
 * Workshop form data for create/update operations (scheduled workshops)
 * Excludes auto-generated fields and completed workshop specific fields
 */
export interface WorkshopFormData {
  title: string;
  course_id?: string;
  instructor_id?: string;
  scheduled_date: string; // ISO timestamp string
  duration_minutes: number;
  location?: string;
  max_capacity: number;
}

/**
 * Enrollment form data for create operations
 * Excludes auto-generated fields (id, timestamps, attendance fields)
 */
export interface EnrollmentFormData {
  student_id: string;
  workshop_id: string;
  notes?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper for student operations
 */
export interface StudentApiResponse {
  data: Student[] | Student | null;
  error: string | null;
  count?: number;
  status?: number;
  message?: string;
}

/**
 * Standard API response wrapper for course operations
 */
export interface CourseApiResponse {
  data: Course[] | Course | null;
  error: string | null;
  count?: number;
  status?: number;
  message?: string;
}

/**
 * Standard API response wrapper for workshop operations
 */
export interface WorkshopApiResponse {
  data: Workshop[] | Workshop | null;
  error: string | null;
  count?: number;
  status?: number;
  message?: string;
}

/**
 * Standard API response wrapper for enrollment operations
 */
export interface EnrollmentApiResponse {
  data: Enrollment[] | Enrollment | null;
  error: string | null;
  count?: number;
  status?: number;
  message?: string;
}

/**
 * Bulk operation response for multiple students
 */
export interface StudentBulkResponse {
  success: Student[];
  errors: Array<{
    data: StudentFormData;
    error: string;
    index: number;
  }>;
  total_processed: number;
  total_success: number;
  total_errors: number;
}

// ============================================================================
// SEARCH AND FILTER TYPES
// ============================================================================

/**
 * Student search and filter parameters
 */
export interface StudentSearchFilters {
  search?: string; // Search across name, school, parent email
  status?: StudentStatus;
  skill_level?: SkillLevel;
  grade_level?: GradeLevel;
  school_name?: string;
  age_min?: number;
  age_max?: number;
  created_after?: string; // ISO date string
  created_before?: string; // ISO date string
  page?: number;
  limit?: number;
  sort_by?: 'full_name' | 'created_at' | 'updated_at' | 'date_of_birth';
  sort_order?: 'asc' | 'desc';
}

/**
 * Course search and filter parameters
 */
export interface CourseSearchFilters {
  search?: string; // Search across name, description
  skill_level_required?: SkillLevel;
  age_group_min?: number;
  age_group_max?: number;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'name' | 'created_at' | 'age_group_min' | 'session_count';
  sort_order?: 'asc' | 'desc';
}

/**
 * Workshop search and filter parameters
 */
export interface WorkshopSearchFilters {
  search?: string; // Search across title, overview
  status?: WorkshopStatus;
  course_id?: string;
  instructor_id?: string;
  scheduled_after?: string; // ISO timestamp string
  scheduled_before?: string; // ISO timestamp string
  location?: string;
  has_available_spots?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'title' | 'scheduled_date' | 'created_at' | 'current_enrollment';
  sort_order?: 'asc' | 'desc';
}

/**
 * Enrollment search and filter parameters
 */
export interface EnrollmentSearchFilters {
  student_id?: string;
  workshop_id?: string;
  attended?: boolean;
  enrolled_after?: string; // ISO timestamp string
  enrolled_before?: string; // ISO timestamp string
  page?: number;
  limit?: number;
  sort_by?: 'enrolled_at' | 'attendance_marked_at';
  sort_order?: 'asc' | 'desc';
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

/**
 * Props for StudentList component
 */
export interface StudentListProps {
  students: Student[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  onView?: (student: Student) => void;
  filters?: StudentSearchFilters;
  onFiltersChange?: (filters: StudentSearchFilters) => void;
}

/**
 * Props for StudentForm component
 */
export interface StudentFormProps {
  student?: Student; // For edit mode
  onSubmit: (data: StudentFormData) => void;
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

/**
 * Props for StudentCard component
 */
export interface StudentCardProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  onView?: (student: Student) => void;
  showActions?: boolean;
}

/**
 * Props for WorkshopList component
 */
export interface WorkshopListProps {
  workshops: Workshop[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (workshop: Workshop) => void;
  onDelete?: (workshopId: string) => void;
  onView?: (workshop: Workshop) => void;
  filters?: WorkshopSearchFilters;
  onFiltersChange?: (filters: WorkshopSearchFilters) => void;
}

/**
 * Props for EnrollmentManager component
 */
export interface EnrollmentManagerProps {
  workshopId: string;
  workshop: Workshop;
  enrollments: Enrollment[];
  students: Student[];
  onEnroll: (studentId: string) => void;
  onUnenroll: (enrollmentId: string) => void;
  onMarkAttendance: (enrollmentId: string, attended: boolean) => void;
  loading?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Database table names as constants
 */
export type StudentTableNames = 'students' | 'courses' | 'workshops' | 'enrollments' | 'students_audit_log';

/**
 * Student field names for form validation and API operations
 */
export type StudentFieldNames = keyof StudentFormData;

/**
 * Student sortable fields
 */
export type StudentSortableFields = 'full_name' | 'created_at' | 'updated_at' | 'date_of_birth' | 'school_name' | 'grade_level';

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

/**
 * API response with pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  error: string | null;
}

/**
 * Bulk import result for students
 */
export interface StudentImportResult {
  total_imported: number;
  successful_imports: Student[];
  failed_imports: Array<{
    row_index: number;
    data: Record<string, unknown>;
    errors: string[];
  }>;
  validation_errors: string[];
}

/**
 * Student statistics summary
 */
export interface StudentStatistics {
  total_students: number;
  active_students: number;
  inactive_students: number;
  suspended_students: number;
  graduated_students: number;
  students_by_skill_level: Record<SkillLevel, number>;
  students_by_grade: Record<string, number>;
  students_by_school: Record<string, number>;
  recent_enrollments: number;
  average_age: number;
}

/**
 * Workshop enrollment statistics
 */
export interface WorkshopEnrollmentStats {
  workshop_id: string;
  workshop_title: string;
  max_capacity: number;
  current_enrollment: number;
  available_spots: number;
  enrollment_percentage: number;
  attendance_rate: number;
  enrolled_students: Student[];
  waitlist_count: number;
}

/**
 * Error handling types
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: ValidationError[];
}

// ============================================================================
// EXPORT ALL TYPES - All types are already exported individually above
// ============================================================================

// Note: All types are exported inline with their definitions above.
// This approach provides better IDE support and prevents duplicate export errors.
