/**
 * Student Management String Constants
 * Following AI Code Better Rules - SCREAMING_SNAKE_CASE, no string literals
 */

// ============================================================================
// STUDENT STATUS CONSTANTS
// ============================================================================

export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  GRADUATED: 'graduated',
  SUSPENDED: 'suspended',
  TRANSFERRED: 'transferred',
  WITHDRAWN: 'withdrawn'
} as const;

export type StudentStatusType = typeof STUDENT_STATUS[keyof typeof STUDENT_STATUS];

// ============================================================================
// SKILL LEVEL CONSTANTS
// ============================================================================

export const STUDENT_SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate', 
  ADVANCED: 'advanced',
  EXPERT: 'expert'
} as const;

export type SkillLevelType = typeof STUDENT_SKILL_LEVELS[keyof typeof STUDENT_SKILL_LEVELS];

// ============================================================================
// GRADE CONSTANTS
// ============================================================================

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

export type GradeType = typeof STUDENT_GRADES[keyof typeof STUDENT_GRADES];

// ============================================================================
// SEARCH FILTER CONSTANTS
// ============================================================================

export const STUDENT_SEARCH_FILTERS = {
  NAME: 'name',
  SCHOOL: 'school',
  GRADE: 'grade',
  STATUS: 'status',
  SKILL_LEVEL: 'skillLevel',
  ENROLLED_COURSES: 'enrolledCourses',
  AGE_RANGE: 'ageRange',
  CREATED_DATE_RANGE: 'createdDateRange'
} as const;

export const STUDENT_SORT_FIELDS = {
  NAME: 'name',
  DATE_OF_BIRTH: 'dateOfBirth',
  SCHOOL: 'school',
  GRADE: 'grade',
  STATUS: 'status',
  SKILL_LEVEL: 'skillLevel',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt'
} as const;

export const SORT_DIRECTIONS = {
  ASCENDING: 'asc',
  DESCENDING: 'desc'
} as const;

// ============================================================================
// FORM FIELD CONSTANTS
// ============================================================================

export const STUDENT_FORM_FIELDS = {
  // Personal Information
  NAME: 'name',
  DATE_OF_BIRTH: 'dateOfBirth',
  SCHOOL: 'school',
  GRADE: 'grade',
  
  // Contact Information
  PARENT_EMAIL: 'parentEmail',
  PARENT_PHONE: 'parentPhone',
  EMERGENCY_CONTACT_NAME: 'emergencyContactName',
  EMERGENCY_CONTACT_PHONE: 'emergencyContactPhone',
  EMERGENCY_CONTACT_RELATION: 'emergencyContactRelation',
  
  // Program Information
  SKILL_LEVEL: 'skillLevel',
  STATUS: 'status',
  
  // Notes and Special Requirements
  SPECIAL_REQUIREMENTS: 'specialRequirements',
  PROGRESS_COMMENTS: 'progressComments',
  MEDICAL_NOTES: 'medicalNotes'
} as const;

export const ENROLLMENT_FORM_FIELDS = {
  STUDENT_ID: 'studentId',
  COURSE_ID: 'courseId',
  WORKSHOP_ID: 'workshopId',
  NOTES: 'notes'
} as const;

// ============================================================================
// API ENDPOINT CONSTANTS
// ============================================================================

export const STUDENT_API_ENDPOINTS = {
  // CRUD Operations
  CREATE_STUDENT: '/api/students',
  GET_STUDENTS: '/api/students',
  GET_STUDENT_BY_ID: '/api/students/:id',
  UPDATE_STUDENT: '/api/students/:id',
  DELETE_STUDENT: '/api/students/:id',
  
  // Bulk Operations
  BULK_CREATE_STUDENTS: '/api/students/bulk',
  BULK_UPDATE_STUDENTS: '/api/students/bulk-update',
  BULK_DELETE_STUDENTS: '/api/students/bulk-delete',
  
  // Enrollment Operations
  ENROLL_STUDENT: '/api/students/:id/enroll',
  UNENROLL_STUDENT: '/api/students/:id/unenroll',
  GET_STUDENT_ENROLLMENTS: '/api/students/:id/enrollments',
  
  // Progress and Statistics
  GET_STUDENT_PROGRESS: '/api/students/:id/progress',
  GET_STUDENT_STATISTICS: '/api/students/statistics',
  
  // Import/Export
  IMPORT_STUDENTS: '/api/students/import',
  EXPORT_STUDENTS: '/api/students/export',
  GET_IMPORT_TEMPLATE: '/api/students/import-template'
} as const;

// ============================================================================
// ERROR MESSAGE CONSTANTS
// ============================================================================

export const STUDENT_ERROR_MESSAGES = {
  // Validation Errors
  NAME_REQUIRED: 'Student name is required',
  NAME_TOO_SHORT: 'Student name must be at least 2 characters',
  NAME_TOO_LONG: 'Student name must be less than 100 characters',
  
  DATE_OF_BIRTH_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_INVALID: 'Please enter a valid date of birth',
  DATE_OF_BIRTH_FUTURE: 'Date of birth cannot be in the future',
  DATE_OF_BIRTH_TOO_OLD: 'Please verify the date of birth',
  
  SCHOOL_REQUIRED: 'School name is required',
  SCHOOL_TOO_LONG: 'School name must be less than 200 characters',
  
  GRADE_REQUIRED: 'Grade is required',
  GRADE_INVALID: 'Please select a valid grade',
  
  PARENT_EMAIL_REQUIRED: 'Parent email is required',
  PARENT_EMAIL_INVALID: 'Please enter a valid email address',
  
  PARENT_PHONE_REQUIRED: 'Parent phone number is required',
  PARENT_PHONE_INVALID: 'Please enter a valid phone number',
  
  EMERGENCY_CONTACT_NAME_REQUIRED: 'Emergency contact name is required',
  EMERGENCY_CONTACT_PHONE_REQUIRED: 'Emergency contact phone is required',
  EMERGENCY_CONTACT_PHONE_INVALID: 'Please enter a valid emergency contact phone',
  EMERGENCY_CONTACT_RELATION_REQUIRED: 'Emergency contact relationship is required',
  
  SKILL_LEVEL_REQUIRED: 'Skill level is required',
  SKILL_LEVEL_INVALID: 'Please select a valid skill level',
  
  STATUS_REQUIRED: 'Status is required',
  STATUS_INVALID: 'Please select a valid status',
  
  // API Errors
  STUDENT_NOT_FOUND: 'Student not found',
  STUDENT_ALREADY_EXISTS: 'A student with this information already exists',
  STUDENT_CREATE_FAILED: 'Failed to create student',
  STUDENT_UPDATE_FAILED: 'Failed to update student',
  STUDENT_DELETE_FAILED: 'Failed to delete student',
  
  // Enrollment Errors
  ENROLLMENT_FAILED: 'Failed to enroll student',
  UNENROLLMENT_FAILED: 'Failed to unenroll student',
  ALREADY_ENROLLED: 'Student is already enrolled in this course/workshop',
  ENROLLMENT_CAPACITY_FULL: 'Cannot enroll - capacity is full',
  ENROLLMENT_PREREQUISITES_NOT_MET: 'Student does not meet prerequisites',
  
  // Bulk Operation Errors
  BULK_IMPORT_FAILED: 'Bulk import failed',
  BULK_EXPORT_FAILED: 'Bulk export failed',
  INVALID_FILE_FORMAT: 'Invalid file format. Please use CSV or Excel format',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB',
  
  // Permission Errors
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action',
  UNAUTHORIZED_ACCESS: 'Unauthorized access to student data',
  
  // Network Errors
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  TIMEOUT_ERROR: 'Request timeout. Please try again'
} as const;

// ============================================================================
// SUCCESS MESSAGE CONSTANTS
// ============================================================================

export const STUDENT_SUCCESS_MESSAGES = {
  // CRUD Operations
  STUDENT_CREATED: 'Student created successfully',
  STUDENT_UPDATED: 'Student updated successfully',
  STUDENT_DELETED: 'Student deleted successfully',
  
  // Enrollment Operations
  STUDENT_ENROLLED: 'Student enrolled successfully',
  STUDENT_UNENROLLED: 'Student unenrolled successfully',
  
  // Bulk Operations
  BULK_IMPORT_SUCCESS: 'Students imported successfully',
  BULK_EXPORT_SUCCESS: 'Students exported successfully',
  BULK_UPDATE_SUCCESS: 'Students updated successfully',
  BULK_DELETE_SUCCESS: 'Students deleted successfully',
  
  // Progress Updates
  PROGRESS_UPDATED: 'Student progress updated successfully',
  SKILL_LEVEL_UPDATED: 'Student skill level updated successfully',
  STATUS_UPDATED: 'Student status updated successfully',
  
  // Data Operations
  DATA_REFRESHED: 'Student data refreshed successfully',
  SEARCH_COMPLETED: 'Search completed successfully',
  FILTERS_APPLIED: 'Filters applied successfully'
} as const;

// ============================================================================
// UI TEXT CONSTANTS
// ============================================================================

export const STUDENT_UI_TEXT = {
  // Page Titles
  STUDENT_MANAGEMENT: 'Student Management',
  STUDENT_LIST: 'Student List',
  ADD_STUDENT: 'Add Student',
  EDIT_STUDENT: 'Edit Student',
  STUDENT_DETAILS: 'Student Details',
  STUDENT_PROGRESS: 'Student Progress',
  
  // Section Headers
  PERSONAL_INFORMATION: 'Personal Information',
  CONTACT_INFORMATION: 'Contact Information',
  PROGRAM_INFORMATION: 'Program Information',
  NOTES_AND_REQUIREMENTS: 'Notes and Special Requirements',
  
  // Form Labels
  STUDENT_NAME: 'Student Name',
  DATE_OF_BIRTH: 'Date of Birth',
  SCHOOL_NAME: 'School',
  GRADE_LEVEL: 'Grade',
  PARENT_EMAIL_ADDRESS: 'Parent Email',
  PARENT_PHONE_NUMBER: 'Parent Phone',
  EMERGENCY_CONTACT: 'Emergency Contact',
  EMERGENCY_PHONE: 'Emergency Phone',
  RELATIONSHIP: 'Relationship',
  SKILL_LEVEL: 'Skill Level',
  STUDENT_STATUS: 'Status',
  SPECIAL_REQUIREMENTS: 'Special Requirements',
  PROGRESS_COMMENTS: 'Progress Comments',
  MEDICAL_NOTES: 'Medical Notes',
  
  // Button Labels
  ADD_NEW_STUDENT: 'Add New Student',
  SAVE_STUDENT: 'Save Student',
  UPDATE_STUDENT: 'Update Student',
  DELETE_STUDENT: 'Delete Student',
  CANCEL: 'Cancel',
  SEARCH: 'Search',
  CLEAR_FILTERS: 'Clear Filters',
  EXPORT_DATA: 'Export Data',
  IMPORT_DATA: 'Import Data',
  ENROLL_STUDENT: 'Enroll Student',
  VIEW_PROGRESS: 'View Progress',
  
  // Status Labels
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  IMPORTING: 'Importing...',
  EXPORTING: 'Exporting...',
  NO_DATA: 'No students found',
  
  // Confirmation Messages
  CONFIRM_DELETE: 'Are you sure you want to delete this student?',
  CONFIRM_BULK_DELETE: 'Are you sure you want to delete the selected students?',
  UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  
  // Placeholders
  SEARCH_PLACEHOLDER: 'Search students by name, school, or ID...',
  NAME_PLACEHOLDER: 'Enter student full name',
  SCHOOL_PLACEHOLDER: 'Enter school name',
  EMAIL_PLACEHOLDER: 'Enter parent email address',
  PHONE_PLACEHOLDER: 'Enter phone number',
  NOTES_PLACEHOLDER: 'Enter any special requirements or notes...'
} as const;

// ============================================================================
// ENROLLMENT STATUS CONSTANTS
// ============================================================================

export const ENROLLMENT_STATUS = {
  ENROLLED: 'enrolled',
  WAITLISTED: 'waitlisted',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
  TRANSFERRED: 'transferred'
} as const;

export type EnrollmentStatusType = typeof ENROLLMENT_STATUS[keyof typeof ENROLLMENT_STATUS];

// ============================================================================
// ATTENDANCE STATUS CONSTANTS
// ============================================================================

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused'
} as const;

export type AttendanceStatusType = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];

// ============================================================================
// EXPORT FORMAT CONSTANTS
// ============================================================================

export const EXPORT_FORMATS = {
  CSV: 'csv',
  XLSX: 'xlsx',
  JSON: 'json'
} as const;

export type ExportFormatType = typeof EXPORT_FORMATS[keyof typeof EXPORT_FORMATS];

// ============================================================================
// AGE GROUP CONSTANTS
// ============================================================================

export const AGE_GROUPS = {
  EARLY_CHILDHOOD: 'early_childhood', // 3-5 years
  ELEMENTARY: 'elementary',           // 6-10 years
  MIDDLE_SCHOOL: 'middle_school',     // 11-13 years
  HIGH_SCHOOL: 'high_school'          // 14-18 years
} as const;

export type AgeGroupType = typeof AGE_GROUPS[keyof typeof AGE_GROUPS];

// ============================================================================
// PAGINATION CONSTANTS
// ============================================================================

export const PAGINATION_LIMITS = {
  SMALL: 10,
  MEDIUM: 25,
  LARGE: 50,
  EXTRA_LARGE: 100
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: PAGINATION_LIMITS.MEDIUM
} as const;

// ============================================================================
// TABLE COLUMN CONSTANTS
// ============================================================================

export const STUDENT_TABLE_COLUMNS = {
  NAME: 'name',
  SCHOOL: 'school',
  GRADE: 'grade',
  STATUS: 'status',
  SKILL_LEVEL: 'skillLevel',
  ENROLLED_COURSES: 'enrolledCourses',
  PARENT_EMAIL: 'parentEmail',
  CREATED_AT: 'createdAt',
  ACTIONS: 'actions'
} as const;

// ============================================================================
// VALIDATION RULE CONSTANTS
// ============================================================================

export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  SCHOOL_MAX_LENGTH: 200,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  EMAIL_MAX_LENGTH: 254,
  NOTES_MAX_LENGTH: 1000,
  MIN_AGE: 3,
  MAX_AGE: 25
} as const;

// All constants are already exported above with individual export statements
