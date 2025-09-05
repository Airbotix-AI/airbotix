/**
 * Student Management Type Definitions
 * Following AI Code Better Rules - explicit interfaces, no any types, string constants
 */

import type { ApiResponse, PaginatedResponse } from './index';
import type { 
  StudentStatusType, 
  SkillLevelType, 
  GradeType,
  EnrollmentStatusType
} from '../constants/student.constants';

// ============================================================================
// CORE STUDENT INTERFACES
// ============================================================================

// Base entity interface for common fields
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends BaseEntity {
  // Personal Information
  name: string;
  dateOfBirth: string; // ISO date string
  school: string;
  grade: string;
  
  // Contact Information
  parentEmail: string;
  parentPhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  
  // Program Information
  enrolledCourses: string[]; // Array of course IDs
  completedWorkshops: string[]; // Array of workshop IDs
  skillLevel: SkillLevelType;
  status: StudentStatusType;
  
  // Notes and Special Requirements
  specialRequirements: string;
  progressComments: string;
  medicalNotes: string;
  
  // System Fields
  createdBy: string; // User ID who created this student
  updatedBy: string; // User ID who last updated this student
}

// ============================================================================
// FORM DATA INTERFACES
// ============================================================================

export interface StudentFormData {
  // Personal Information
  name: string;
  dateOfBirth: string;
  school: string;
  grade: string;
  
  // Contact Information
  parentEmail: string;
  parentPhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  
  // Program Information
  skillLevel: SkillLevelType;
  status: StudentStatusType;
  
  // Notes and Special Requirements
  specialRequirements: string;
  progressComments: string;
  medicalNotes: string;
}

export interface StudentFormErrors {
  name?: string;
  dateOfBirth?: string;
  school?: string;
  grade?: string;
  parentEmail?: string;
  parentPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  skillLevel?: string;
  status?: string;
  specialRequirements?: string;
  progressComments?: string;
  medicalNotes?: string;
}

// ============================================================================
// SEARCH AND FILTER INTERFACES
// ============================================================================

export interface StudentSearchFilters {
  name?: string;
  school?: string;
  grade?: GradeType;
  status?: StudentStatusType;
  skillLevel?: SkillLevelType;
  enrolledCourses?: string[];
  ageRange?: {
    min: number;
    max: number;
  };
  createdDateRange?: {
    start: string;
    end: string;
  };
}

export interface StudentSortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface StudentListParams {
  filters?: StudentSearchFilters;
  sort?: StudentSortOptions;
  page?: number;
  limit?: number;
  search?: string;
}

// ============================================================================
// ENROLLMENT INTERFACES
// ============================================================================

export interface StudentEnrollment extends BaseEntity {
  studentId: string;
  courseId: string;
  workshopId: string;
  enrollmentDate: string;
  status: EnrollmentStatusType;
  attended: boolean;
  attendanceTime?: string;
  notes?: string;
}

export interface EnrollmentFormData {
  studentId: string;
  courseId?: string;
  workshopId?: string;
  notes?: string;
}

export interface BulkEnrollmentData {
  studentIds: string[];
  courseId?: string;
  workshopId?: string;
  notes?: string;
}

// ============================================================================
// PROGRESS TRACKING INTERFACES
// ============================================================================

export interface StudentProgress {
  studentId: string;
  totalWorkshops: number;
  completedWorkshops: number;
  attendanceRate: number;
  currentCourses: string[];
  completedCourses: string[];
  skillProgression: SkillProgressionEntry[];
  lastActivity: string;
}

export interface SkillProgressionEntry {
  date: string;
  previousLevel: SkillLevelType;
  newLevel: SkillLevelType;
  assessedBy: string;
  notes: string;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

export interface StudentApiResponse extends ApiResponse<Student> {
}

export interface StudentListApiResponse extends ApiResponse<PaginatedResponse<Student>> {
}

export interface StudentEnrollmentApiResponse extends ApiResponse<StudentEnrollment> {
}

export interface StudentProgressApiResponse extends ApiResponse<StudentProgress> {
}

export interface BulkStudentApiResponse extends ApiResponse<{
  successful: Student[];
  failed: {
    data: StudentFormData;
    error: string;
  }[];
}> {
}

// ============================================================================
// COMPONENT PROPS INTERFACES
// ============================================================================

export interface StudentListProps {
  students: Student[];
  loading: boolean;
  error?: string;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onEnroll: (studentId: string) => void;
  onViewProgress: (studentId: string) => void;
}

export interface StudentFormProps {
  student?: Student;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  loading: boolean;
  errors?: StudentFormErrors;
}

export interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onEnroll: (studentId: string) => void;
  onViewProgress: (studentId: string) => void;
  compact?: boolean;
}

export interface StudentSearchProps {
  filters: StudentSearchFilters;
  onFiltersChange: (filters: StudentSearchFilters) => void;
  onSearch: (query: string) => void;
  onClear: () => void;
  loading: boolean;
}

export interface StudentEnrollmentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (data: EnrollmentFormData) => void;
  loading: boolean;
  availableCourses: Course[];
  availableWorkshops: Workshop[];
}

export interface StudentProgressModalProps {
  student: Student;
  progress: StudentProgress;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export interface BulkStudentImportProps {
  onImport: (students: StudentFormData[]) => void;
  onCancel: () => void;
  loading: boolean;
  template: StudentFormData;
}

// ============================================================================
// UTILITY INTERFACES
// ============================================================================

export interface StudentExportData {
  format: 'csv' | 'xlsx' | 'json';
  filters?: StudentSearchFilters;
  includeProgress: boolean;
  includeEnrollments: boolean;
}

export interface StudentImportResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: {
    row: number;
    field: string;
    message: string;
  }[];
}

export interface StudentStatistics {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
  byGrade: Record<string, number>;
  bySkillLevel: Record<string, number>;
  bySchool: Record<string, number>;
  averageAge: number;
  enrollmentTrends: {
    month: string;
    count: number;
  }[];
}

// ============================================================================
// TYPE UNIONS AND UTILITY TYPES
// ============================================================================

// Type unions are imported from constants file for consistency

// Search filter keys
export type StudentSearchField = keyof StudentSearchFilters;

// Sortable fields
export type StudentSortField = keyof Pick<Student, 
  | 'name' 
  | 'dateOfBirth' 
  | 'school' 
  | 'grade' 
  | 'status' 
  | 'skillLevel'
> | 'createdAt' | 'updatedAt';

// Form field names
export type StudentFormField = keyof StudentFormData;

// Export all types for easy importing
export type {
  // Re-export from base types that may be needed
  ApiResponse,
  PaginatedResponse
};

// Course and Workshop interfaces (referenced but defined elsewhere)
interface Course {
  id: string;
  name: string;
  description: string;
  ageGroup: string;
  sessionCount: number;
}

interface Workshop {
  id: string;
  title: string;
  date: string;
  capacity: number;
  enrolledCount: number;
}
