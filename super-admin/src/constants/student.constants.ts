/**
 * Student Management String Constants
 * 
 * Comprehensive string constants for Student Management module matching database enums exactly.
 * All constants use SCREAMING_SNAKE_CASE naming convention and are exported as const assertions
 * for type safety and IntelliSense support.
 * 
 * Database Schema Reference:
 * - Enums from: /super-admin/supabase/migrations/20250910071320_fix_create_students_table.sql
 * - User roles from: /super-admin/supabase/migrations/20250910063129_create_user_profiles_and_roles.sql
 * - Workshop status from: /super-admin/supabase/migrations/20250910120007_create_courses_workshops_enrollments.sql
 * 
 * @file student.constants.ts
 * @version 1.0.0
 */

// ============================================================================
// STUDENT STATUS CONSTANTS (from database enum: student_status)
// ============================================================================

/**
 * Student status values matching database enum exactly
 * Enum: student_status ('active', 'inactive', 'suspended', 'graduated')
 */
export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  GRADUATED: 'graduated'
} as const;

/**
 * Student status display labels for UI
 */
export const STUDENT_STATUS_LABELS = {
  [STUDENT_STATUS.ACTIVE]: 'Active',
  [STUDENT_STATUS.INACTIVE]: 'Inactive',
  [STUDENT_STATUS.SUSPENDED]: 'Suspended',
  [STUDENT_STATUS.GRADUATED]: 'Graduated'
} as const;

/**
 * Student status colors for UI components
 */
export const STUDENT_STATUS_COLORS: Record<typeof STUDENT_STATUS[keyof typeof STUDENT_STATUS], 'green' | 'gray' | 'red' | 'blue'> = {
  [STUDENT_STATUS.ACTIVE]: 'green',
  [STUDENT_STATUS.INACTIVE]: 'gray',
  [STUDENT_STATUS.SUSPENDED]: 'red',
  [STUDENT_STATUS.GRADUATED]: 'blue'
} as const;

// ============================================================================
// STUDENT SKILL LEVELS (from database enum: student_skill_level)
// ============================================================================

/**
 * Student skill level values matching database enum exactly
 * Enum: student_skill_level ('beginner', 'intermediate', 'advanced')
 */
export const STUDENT_SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const;

/**
 * Student skill level display labels for UI
 */
export const STUDENT_SKILL_LEVEL_LABELS = {
  [STUDENT_SKILL_LEVELS.BEGINNER]: 'Beginner',
  [STUDENT_SKILL_LEVELS.INTERMEDIATE]: 'Intermediate',
  [STUDENT_SKILL_LEVELS.ADVANCED]: 'Advanced'
} as const;

/**
 * Student skill level descriptions for forms
 */
export const STUDENT_SKILL_LEVEL_DESCRIPTIONS = {
  [STUDENT_SKILL_LEVELS.BEGINNER]: 'No prior programming or robotics experience',
  [STUDENT_SKILL_LEVELS.INTERMEDIATE]: 'Some programming or robotics experience',
  [STUDENT_SKILL_LEVELS.ADVANCED]: 'Significant programming and robotics experience'
} as const;

// ============================================================================
// GRADE LEVELS (K-12 system matching database constraint)
// ============================================================================

/**
 * Grade level values matching database constraint: grade_level ~ '^(K|[1-9]|1[0-2])$'
 */
export const STUDENT_GRADES = {
  KINDERGARTEN: 'K',
  GRADE_1: '1',
  GRADE_2: '2',
  GRADE_3: '3',
  GRADE_4: '4',
  GRADE_5: '5',
  GRADE_6: '6',
  GRADE_7: '7',
  GRADE_8: '8',
  GRADE_9: '9',
  GRADE_10: '10',
  GRADE_11: '11',
  GRADE_12: '12'
} as const;

/**
 * Grade level display labels for UI
 */
export const STUDENT_GRADE_LABELS = {
  [STUDENT_GRADES.KINDERGARTEN]: 'Kindergarten',
  [STUDENT_GRADES.GRADE_1]: '1st Grade',
  [STUDENT_GRADES.GRADE_2]: '2nd Grade',
  [STUDENT_GRADES.GRADE_3]: '3rd Grade',
  [STUDENT_GRADES.GRADE_4]: '4th Grade',
  [STUDENT_GRADES.GRADE_5]: '5th Grade',
  [STUDENT_GRADES.GRADE_6]: '6th Grade',
  [STUDENT_GRADES.GRADE_7]: '7th Grade',
  [STUDENT_GRADES.GRADE_8]: '8th Grade',
  [STUDENT_GRADES.GRADE_9]: '9th Grade',
  [STUDENT_GRADES.GRADE_10]: '10th Grade',
  [STUDENT_GRADES.GRADE_11]: '11th Grade',
  [STUDENT_GRADES.GRADE_12]: '12th Grade'
} as const;

/**
 * Grade level categories for grouping
 */
export const STUDENT_GRADE_CATEGORIES = {
  ELEMENTARY: 'elementary',
  MIDDLE: 'middle',
  HIGH: 'high'
} as const;

/**
 * Grade level to category mapping
 */
export const STUDENT_GRADE_TO_CATEGORY = {
  [STUDENT_GRADES.KINDERGARTEN]: STUDENT_GRADE_CATEGORIES.ELEMENTARY,
  [STUDENT_GRADES.GRADE_1]: STUDENT_GRADE_CATEGORIES.ELEMENTARY,
  [STUDENT_GRADES.GRADE_2]: STUDENT_GRADE_CATEGORIES.ELEMENTARY,
  [STUDENT_GRADES.GRADE_3]: STUDENT_GRADE_CATEGORIES.ELEMENTARY,
  [STUDENT_GRADES.GRADE_4]: STUDENT_GRADE_CATEGORIES.ELEMENTARY,
  [STUDENT_GRADES.GRADE_5]: STUDENT_GRADE_CATEGORIES.ELEMENTARY,
  [STUDENT_GRADES.GRADE_6]: STUDENT_GRADE_CATEGORIES.MIDDLE,
  [STUDENT_GRADES.GRADE_7]: STUDENT_GRADE_CATEGORIES.MIDDLE,
  [STUDENT_GRADES.GRADE_8]: STUDENT_GRADE_CATEGORIES.MIDDLE,
  [STUDENT_GRADES.GRADE_9]: STUDENT_GRADE_CATEGORIES.HIGH,
  [STUDENT_GRADES.GRADE_10]: STUDENT_GRADE_CATEGORIES.HIGH,
  [STUDENT_GRADES.GRADE_11]: STUDENT_GRADE_CATEGORIES.HIGH,
  [STUDENT_GRADES.GRADE_12]: STUDENT_GRADE_CATEGORIES.HIGH
} as const;

// ============================================================================
// USER ROLES (from database enum: user_role)
// ============================================================================

/**
 * User role values matching database enum exactly
 * Enum: user_role ('super_admin', 'admin', 'teacher', 'student')
 */
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
} as const;

/**
 * User role display labels for UI
 */
export const USER_ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.TEACHER]: 'Teacher',
  [USER_ROLES.STUDENT]: 'Student'
} as const;

/**
 * User role descriptions for permission system
 */
export const USER_ROLE_DESCRIPTIONS = {
  [USER_ROLES.SUPER_ADMIN]: 'Full system access with all permissions',
  [USER_ROLES.ADMIN]: 'Administrative access to manage students, teachers, and workshops',
  [USER_ROLES.TEACHER]: 'Limited access to view students and assigned workshops',
  [USER_ROLES.STUDENT]: 'Minimal access for student portal features'
} as const;

// ============================================================================
// WORKSHOP STATUS (from database enum: workshop_status)
// ============================================================================

/**
 * Workshop status values matching database enum exactly
 * Enum: workshop_status ('draft', 'completed', 'archived', 'scheduled', 'cancelled')
 */
export const WORKSHOP_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled'
} as const;

/**
 * Workshop status display labels for UI
 */
export const WORKSHOP_STATUS_LABELS = {
  [WORKSHOP_STATUS.DRAFT]: 'Draft',
  [WORKSHOP_STATUS.COMPLETED]: 'Completed',
  [WORKSHOP_STATUS.ARCHIVED]: 'Archived',
  [WORKSHOP_STATUS.SCHEDULED]: 'Scheduled',
  [WORKSHOP_STATUS.CANCELLED]: 'Cancelled'
} as const;

/**
 * Workshop status colors for UI components
 */
export const WORKSHOP_STATUS_COLORS: Record<typeof WORKSHOP_STATUS[keyof typeof WORKSHOP_STATUS], 'gray' | 'green' | 'purple' | 'blue' | 'red'> = {
  [WORKSHOP_STATUS.DRAFT]: 'gray',
  [WORKSHOP_STATUS.COMPLETED]: 'green',
  [WORKSHOP_STATUS.ARCHIVED]: 'purple',
  [WORKSHOP_STATUS.SCHEDULED]: 'blue',
  [WORKSHOP_STATUS.CANCELLED]: 'red'
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Student API endpoints for REST operations
 */
export const STUDENT_API_ENDPOINTS = {
  GET_ALL: '/api/students',
  GET_BY_ID: '/api/students/:id',
  CREATE: '/api/students',
  UPDATE: '/api/students/:id',
  DELETE: '/api/students/:id',
  SEARCH: '/api/students/search',
  BULK_IMPORT: '/api/students/import',
  BULK_UPDATE: '/api/students/bulk-update',
  BULK_DELETE: '/api/students/bulk-delete',
  EXPORT: '/api/students/export',
  STATISTICS: '/api/students/statistics'
} as const;

/**
 * Course API endpoints for REST operations
 */
export const COURSE_API_ENDPOINTS = {
  GET_ALL: '/api/courses',
  GET_BY_ID: '/api/courses/:id',
  CREATE: '/api/courses',
  UPDATE: '/api/courses/:id',
  DELETE: '/api/courses/:id',
  SEARCH: '/api/courses/search'
} as const;

/**
 * Workshop API endpoints for REST operations
 */
export const WORKSHOP_API_ENDPOINTS = {
  GET_ALL: '/api/workshops',
  GET_BY_ID: '/api/workshops/:id',
  CREATE: '/api/workshops',
  UPDATE: '/api/workshops/:id',
  DELETE: '/api/workshops/:id',
  SEARCH: '/api/workshops/search',
  GET_SCHEDULED: '/api/workshops/scheduled',
  GET_COMPLETED: '/api/workshops/completed',
  ENROLLMENT_STATS: '/api/workshops/:id/enrollment-stats'
} as const;

/**
 * Enrollment API endpoints for REST operations
 */
export const ENROLLMENT_API_ENDPOINTS = {
  GET_ALL: '/api/enrollments',
  GET_BY_ID: '/api/enrollments/:id',
  CREATE: '/api/enrollments',
  DELETE: '/api/enrollments/:id',
  GET_BY_WORKSHOP: '/api/workshops/:workshop_id/enrollments',
  GET_BY_STUDENT: '/api/students/:student_id/enrollments',
  MARK_ATTENDANCE: '/api/enrollments/:id/attendance',
  BULK_ENROLL: '/api/enrollments/bulk'
} as const;

// ============================================================================
// FORM FIELD NAMES
// ============================================================================

/**
 * Student form field names matching database column names exactly
 */
export const STUDENT_FORM_FIELDS = {
  FULL_NAME: 'full_name',
  DATE_OF_BIRTH: 'date_of_birth',
  SCHOOL_NAME: 'school_name',
  GRADE_LEVEL: 'grade_level',
  PARENT_NAME: 'parent_name',
  PARENT_EMAIL: 'parent_email',
  PARENT_PHONE: 'parent_phone',
  EMERGENCY_CONTACT_NAME: 'emergency_contact_name',
  EMERGENCY_CONTACT_PHONE: 'emergency_contact_phone',
  SKILL_LEVEL: 'skill_level',
  STATUS: 'status',
  SPECIAL_REQUIREMENTS: 'special_requirements',
  MEDICAL_NOTES: 'medical_notes'
} as const;

/**
 * Course form field names matching database column names exactly
 */
export const COURSE_FORM_FIELDS = {
  NAME: 'name',
  DESCRIPTION: 'description',
  AGE_GROUP_MIN: 'age_group_min',
  AGE_GROUP_MAX: 'age_group_max',
  SESSION_COUNT: 'session_count',
  SKILL_LEVEL_REQUIRED: 'skill_level_required',
  IS_ACTIVE: 'is_active'
} as const;

/**
 * Workshop form field names matching database column names exactly
 */
export const WORKSHOP_FORM_FIELDS = {
  TITLE: 'title',
  COURSE_ID: 'course_id',
  INSTRUCTOR_ID: 'instructor_id',
  SCHEDULED_DATE: 'scheduled_date',
  DURATION_MINUTES: 'duration_minutes',
  LOCATION: 'location',
  MAX_CAPACITY: 'max_capacity',
  STATUS: 'status'
} as const;

/**
 * Enrollment form field names matching database column names exactly
 */
export const ENROLLMENT_FORM_FIELDS = {
  STUDENT_ID: 'student_id',
  WORKSHOP_ID: 'workshop_id',
  NOTES: 'notes',
  ATTENDED: 'attended'
} as const;

// ============================================================================
// DATABASE TABLE NAMES
// ============================================================================

/**
 * Database table names for direct SQL operations and migrations
 */
export const DATABASE_TABLES = {
  STUDENTS: 'students',
  COURSES: 'courses',
  WORKSHOPS: 'workshops',
  ENROLLMENTS: 'enrollments',
  PROFILES: 'profiles',
  STUDENTS_AUDIT_LOG: 'students_audit_log',
  WORKSHOPS_AUDIT_LOG: 'workshops_audit_log',
  ROLE_PERMISSIONS: 'role_permissions'
} as const;

/**
 * Database column names for students table
 */
export const STUDENT_TABLE_COLUMNS = {
  ID: 'id',
  FULL_NAME: 'full_name',
  DATE_OF_BIRTH: 'date_of_birth',
  SCHOOL_NAME: 'school_name',
  GRADE_LEVEL: 'grade_level',
  PARENT_NAME: 'parent_name',
  PARENT_EMAIL: 'parent_email',
  PARENT_PHONE: 'parent_phone',
  EMERGENCY_CONTACT_NAME: 'emergency_contact_name',
  EMERGENCY_CONTACT_PHONE: 'emergency_contact_phone',
  SKILL_LEVEL: 'skill_level',
  STATUS: 'status',
  SPECIAL_REQUIREMENTS: 'special_requirements',
  MEDICAL_NOTES: 'medical_notes',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  CREATED_BY: 'created_by',
  UPDATED_BY: 'updated_by'
} as const;

// ============================================================================
// SUCCESS AND ERROR MESSAGES
// ============================================================================

/**
 * Student operation success messages
 */
export const STUDENT_SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'Student created successfully',
  UPDATE_SUCCESS: 'Student updated successfully',
  DELETE_SUCCESS: 'Student deleted successfully',
  BULK_IMPORT_SUCCESS: 'Students imported successfully',
  BULK_UPDATE_SUCCESS: 'Students updated successfully',
  BULK_DELETE_SUCCESS: 'Students deleted successfully',
  EXPORT_SUCCESS: 'Student data exported successfully'
} as const;

/**
 * Student operation error messages
 */
export const STUDENT_ERROR_MESSAGES = {
  CREATE_ERROR: 'Failed to create student',
  UPDATE_ERROR: 'Failed to update student',
  DELETE_ERROR: 'Failed to delete student',
  FETCH_ERROR: 'Failed to fetch student data',
  NOT_FOUND: 'Student not found',
  VALIDATION_ERROR: 'Please check the form data',
  DUPLICATE_EMAIL: 'A student with this parent email already exists',
  AGE_VALIDATION_ERROR: 'Student age must be between 5 and 18 years',
  BULK_IMPORT_ERROR: 'Failed to import students',
  PERMISSION_DENIED: 'You do not have permission to perform this action',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  SERVER_ERROR: 'Server error occurred. Please contact support.'
} as const;

/**
 * Workshop operation success messages
 */
export const WORKSHOP_SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'Workshop created successfully',
  UPDATE_SUCCESS: 'Workshop updated successfully',
  DELETE_SUCCESS: 'Workshop deleted successfully',
  SCHEDULE_SUCCESS: 'Workshop scheduled successfully',
  CANCEL_SUCCESS: 'Workshop cancelled successfully'
} as const;

/**
 * Workshop operation error messages
 */
export const WORKSHOP_ERROR_MESSAGES = {
  CREATE_ERROR: 'Failed to create workshop',
  UPDATE_ERROR: 'Failed to update workshop',
  DELETE_ERROR: 'Failed to delete workshop',
  FETCH_ERROR: 'Failed to fetch workshop data',
  NOT_FOUND: 'Workshop not found',
  CAPACITY_EXCEEDED: 'Workshop capacity exceeded',
  SCHEDULE_CONFLICT: 'Schedule conflict detected',
  INSTRUCTOR_UNAVAILABLE: 'Instructor is not available at this time'
} as const;

/**
 * Enrollment operation success messages
 */
export const ENROLLMENT_SUCCESS_MESSAGES = {
  ENROLL_SUCCESS: 'Student enrolled successfully',
  UNENROLL_SUCCESS: 'Student unenrolled successfully',
  ATTENDANCE_MARKED: 'Attendance marked successfully',
  BULK_ENROLL_SUCCESS: 'Students enrolled successfully'
} as const;

/**
 * Enrollment operation error messages
 */
export const ENROLLMENT_ERROR_MESSAGES = {
  ENROLL_ERROR: 'Failed to enroll student',
  UNENROLL_ERROR: 'Failed to unenroll student',
  ALREADY_ENROLLED: 'Student is already enrolled in this workshop',
  WORKSHOP_FULL: 'Workshop is at full capacity',
  WORKSHOP_NOT_AVAILABLE: 'Workshop is not available for enrollment',
  STUDENT_NOT_ELIGIBLE: 'Student is not eligible for this workshop'
} as const;

// ============================================================================
// SEARCH AND FILTER CONSTANTS
// ============================================================================

/**
 * Search filter options for students
 */
export const STUDENT_SEARCH_FILTERS = {
  ALL_STATUSES: 'all_statuses',
  ALL_SKILL_LEVELS: 'all_skill_levels',
  ALL_GRADES: 'all_grades',
  ALL_SCHOOLS: 'all_schools'
} as const;

/**
 * Sort options for student list
 */
export const STUDENT_SORT_OPTIONS = {
  NAME_ASC: 'full_name_asc',
  NAME_DESC: 'full_name_desc',
  CREATED_ASC: 'created_at_asc',
  CREATED_DESC: 'created_at_desc',
  UPDATED_ASC: 'updated_at_asc',
  UPDATED_DESC: 'updated_at_desc',
  AGE_ASC: 'date_of_birth_desc',
  AGE_DESC: 'date_of_birth_asc',
  GRADE_ASC: 'grade_level_asc',
  GRADE_DESC: 'grade_level_desc'
} as const;

/**
 * Sort option labels for UI
 */
export const STUDENT_SORT_LABELS = {
  [STUDENT_SORT_OPTIONS.NAME_ASC]: 'Name (A-Z)',
  [STUDENT_SORT_OPTIONS.NAME_DESC]: 'Name (Z-A)',
  [STUDENT_SORT_OPTIONS.CREATED_ASC]: 'Oldest First',
  [STUDENT_SORT_OPTIONS.CREATED_DESC]: 'Newest First',
  [STUDENT_SORT_OPTIONS.UPDATED_ASC]: 'Last Updated (Oldest)',
  [STUDENT_SORT_OPTIONS.UPDATED_DESC]: 'Last Updated (Newest)',
  [STUDENT_SORT_OPTIONS.AGE_ASC]: 'Youngest First',
  [STUDENT_SORT_OPTIONS.AGE_DESC]: 'Oldest First',
  [STUDENT_SORT_OPTIONS.GRADE_ASC]: 'Grade (Lowest)',
  [STUDENT_SORT_OPTIONS.GRADE_DESC]: 'Grade (Highest)'
} as const;

// ============================================================================
// PAGINATION CONSTANTS
// ============================================================================

/**
 * Pagination settings
 */
export const PAGINATION_SETTINGS = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const
} as const;

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/**
 * Validation rules and limits from database constraints
 */
export const VALIDATION_RULES = {
  STUDENT_NAME_MIN_LENGTH: 2,
  STUDENT_NAME_MAX_LENGTH: 255,
  SCHOOL_NAME_MIN_LENGTH: 2,
  SCHOOL_NAME_MAX_LENGTH: 255,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  EMAIL_REGEX: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  GRADE_LEVEL_REGEX: /^(K|[1-9]|1[0-2])$/,
  SPECIAL_REQUIREMENTS_MAX_LENGTH: 1000,
  MEDICAL_NOTES_MAX_LENGTH: 1000,
  MIN_STUDENT_AGE: 5,
  MAX_STUDENT_AGE: 18
} as const;

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_AGE: 'Student age must be between 5 and 18 years',
  NAME_TOO_SHORT: 'Name must be at least 2 characters long',
  NAME_TOO_LONG: 'Name cannot exceed 255 characters',
  TEXT_TOO_LONG: 'Text cannot exceed the maximum length',
  INVALID_GRADE: 'Please select a valid grade level'
} as const;

// ============================================================================
// EXPORT TYPE ASSERTIONS
// ============================================================================

/**
 * Type assertion for student status values
 */
export type StudentStatusValue = typeof STUDENT_STATUS[keyof typeof STUDENT_STATUS];

/**
 * Type assertion for skill level values
 */
export type SkillLevelValue = typeof STUDENT_SKILL_LEVELS[keyof typeof STUDENT_SKILL_LEVELS];

/**
 * Type assertion for grade values
 */
export type GradeValue = typeof STUDENT_GRADES[keyof typeof STUDENT_GRADES];

/**
 * Type assertion for user role values
 */
export type UserRoleValue = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Type assertion for workshop status values
 */
export type WorkshopStatusValue = typeof WORKSHOP_STATUS[keyof typeof WORKSHOP_STATUS];

// ============================================================================
// EXPORTS - All constants are already exported individually above
// ============================================================================

// Note: All constants are exported inline with their definitions above.
// This approach provides better IDE support and prevents duplicate export errors.
