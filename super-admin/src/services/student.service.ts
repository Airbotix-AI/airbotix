/**
 * Student Management Supabase Service Functions
 * 
 * Comprehensive CRUD operations for Student Management using Supabase with RLS policies.
 * All functions use exact table/column names from database migrations and TypeScript
 * interfaces from student.types.ts. Implements proper error handling and logging.
 * 
 * Database Schema Reference:
 * - Table: public.students (from migration 20250910071320_fix_create_students_table.sql)
 * - RLS Policies: Role-based access control (super_admin, admin, teacher permissions)
 * - Audit Log: public.students_audit_log for change tracking
 * 
 * @file student.service.ts
 * @version 1.0.0
 */

import { supabase } from '../lib/supabase'
import type {
  Student,
  StudentFormData,
  StudentApiResponse,
  StudentSearchFilters,
  StudentBulkResponse,
  StudentStatistics,
  SkillLevel,
  StudentStatus
} from '../types/student.types'
import {
  DATABASE_TABLES,
  STUDENT_TABLE_COLUMNS,
  STUDENT_STATUS,
  STUDENT_SKILL_LEVELS,
  PAGINATION_SETTINGS,
  STUDENT_SUCCESS_MESSAGES,
  STUDENT_ERROR_MESSAGES,
  VALIDATION_RULES
} from '../constants/student.constants'

// ============================================================================
// SERVICE RESPONSE INTERFACE
// ============================================================================

/**
 * Standard service response wrapper for consistent error handling
 */
interface ServiceResponse<T> {
  data: T | null
  error: string | null
  success: boolean
  status?: number
  count?: number
}

// ============================================================================
// FETCH OPERATIONS
// ============================================================================

/**
 * Fetches all students with pagination and filtering using Supabase RLS policies
 * 
 * @param filters - Optional search and filter parameters
 * @returns Promise<StudentApiResponse> - Array of students with metadata
 * 
 * @example
 * ```typescript
 * const result = await fetchAllStudents({
 *   search: 'john',
 *   status: 'active',
 *   page: 1,
 *   limit: 25
 * })
 * ```
 */
export async function fetchAllStudents(
  filters: StudentSearchFilters = {}
): Promise<StudentApiResponse> {
  try {
    const {
      search = '',
      status,
      skill_level,
      grade_level,
      school_name,
      age_min,
      age_max,
      created_after,
      created_before,
      page = 1,
      limit = PAGINATION_SETTINGS.DEFAULT_PAGE_SIZE,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = filters

    // Calculate pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Start building query with RLS policies automatically applied
    let query = supabase
      .from(DATABASE_TABLES.STUDENTS)
      .select('*', { count: 'exact' })

    // Apply text search across multiple fields
    if (search && search.length >= VALIDATION_RULES.STUDENT_NAME_MIN_LENGTH) {
      query = query.or(`${STUDENT_TABLE_COLUMNS.FULL_NAME}.ilike.%${search}%,${STUDENT_TABLE_COLUMNS.SCHOOL_NAME}.ilike.%${search}%,${STUDENT_TABLE_COLUMNS.PARENT_EMAIL}.ilike.%${search}%,${STUDENT_TABLE_COLUMNS.PARENT_NAME}.ilike.%${search}%`)
    }

    // Apply status filter
    if (status && Object.values(STUDENT_STATUS).includes(status as StudentStatus)) {
      query = query.eq(STUDENT_TABLE_COLUMNS.STATUS, status)
    }

    // Apply skill level filter
    if (skill_level && Object.values(STUDENT_SKILL_LEVELS).includes(skill_level as SkillLevel)) {
      query = query.eq(STUDENT_TABLE_COLUMNS.SKILL_LEVEL, skill_level)
    }

    // Apply grade level filter
    if (grade_level && VALIDATION_RULES.GRADE_LEVEL_REGEX.test(grade_level)) {
      query = query.eq(STUDENT_TABLE_COLUMNS.GRADE_LEVEL, grade_level)
    }

    // Apply school name filter
    if (school_name) {
      query = query.eq(STUDENT_TABLE_COLUMNS.SCHOOL_NAME, school_name)
    }

    // Apply age range filters using date_of_birth
    if (age_min || age_max) {
      const currentDate = new Date()
      
      if (age_max) {
        const minDate = new Date(currentDate.getFullYear() - age_max - 1, currentDate.getMonth(), currentDate.getDate())
        query = query.gte(STUDENT_TABLE_COLUMNS.DATE_OF_BIRTH, minDate.toISOString().split('T')[0])
      }
      
      if (age_min) {
        const maxDate = new Date(currentDate.getFullYear() - age_min, currentDate.getMonth(), currentDate.getDate())
        query = query.lte(STUDENT_TABLE_COLUMNS.DATE_OF_BIRTH, maxDate.toISOString().split('T')[0])
      }
    }

    // Apply date range filters
    if (created_after) {
      query = query.gte(STUDENT_TABLE_COLUMNS.CREATED_AT, created_after)
    }

    if (created_before) {
      query = query.lte(STUDENT_TABLE_COLUMNS.CREATED_AT, created_before)
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' })

    // Apply pagination
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching students:', error)
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.FETCH_ERROR,
        count: 0
      }
    }

    return {
      data: data as Student[],
      error: null,
      count: count || 0
    }

  } catch (error) {
    console.error('Unexpected error in fetchAllStudents:', error)
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      count: 0
    }
  }
}

/**
 * Fetches a single student by ID using Supabase RLS policies
 * 
 * @param id - Student UUID
 * @returns Promise<StudentApiResponse> - Single student or null if not found
 * 
 * @example
 * ```typescript
 * const result = await fetchStudentById('123e4567-e89b-12d3-a456-426614174000')
 * ```
 */
export async function fetchStudentById(id: string): Promise<StudentApiResponse> {
  try {
    if (!id || typeof id !== 'string') {
      return {
        data: null,
        error: 'Invalid student ID provided'
      }
    }

    const { data, error } = await supabase
      .from(DATABASE_TABLES.STUDENTS)
      .select('*')
      .eq(STUDENT_TABLE_COLUMNS.ID, id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: STUDENT_ERROR_MESSAGES.NOT_FOUND
        }
      }
      
      console.error('Error fetching student by ID:', error)
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.FETCH_ERROR
      }
    }

    return {
      data: data as Student,
      error: null
    }

  } catch (error) {
    console.error('Unexpected error in fetchStudentById:', error)
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR
    }
  }
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Creates a new student record with validation and audit logging
 * 
 * @param data - Student form data (excludes auto-generated fields)
 * @returns Promise<StudentApiResponse> - Created student record
 * 
 * @example
 * ```typescript
 * const result = await createNewStudent({
 *   full_name: 'John Doe',
 *   date_of_birth: '2010-05-15',
 *   school_name: 'Lincoln Elementary',
 *   grade_level: '5',
 *   parent_email: 'parent@example.com',
 *   parent_phone: '+1234567890',
 *   skill_level: 'beginner'
 * })
 * ```
 */
export async function createNewStudent(data: StudentFormData): Promise<StudentApiResponse> {
  try {
    // Validate required fields
    const validationError = validateStudentData(data)
    if (validationError) {
      return {
        data: null,
        error: validationError
      }
    }

    // Check for duplicate parent email
    const { data: existing } = await supabase
      .from(DATABASE_TABLES.STUDENTS)
      .select(STUDENT_TABLE_COLUMNS.ID)
      .eq(STUDENT_TABLE_COLUMNS.PARENT_EMAIL, data.parent_email)
      .single()

    if (existing) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.DUPLICATE_EMAIL
      }
    }

    // Insert new student (created_by and timestamps set by database triggers)
    const { data: newStudent, error } = await supabase
      .from(DATABASE_TABLES.STUDENTS)
      .insert([{
        [STUDENT_TABLE_COLUMNS.FULL_NAME]: data.full_name,
        [STUDENT_TABLE_COLUMNS.DATE_OF_BIRTH]: data.date_of_birth,
        [STUDENT_TABLE_COLUMNS.SCHOOL_NAME]: data.school_name,
        [STUDENT_TABLE_COLUMNS.GRADE_LEVEL]: data.grade_level,
        [STUDENT_TABLE_COLUMNS.PARENT_NAME]: data.parent_name,
        [STUDENT_TABLE_COLUMNS.PARENT_EMAIL]: data.parent_email,
        [STUDENT_TABLE_COLUMNS.PARENT_PHONE]: data.parent_phone,
        [STUDENT_TABLE_COLUMNS.EMERGENCY_CONTACT_NAME]: data.emergency_contact_name || null,
        [STUDENT_TABLE_COLUMNS.EMERGENCY_CONTACT_PHONE]: data.emergency_contact_phone || null,
        [STUDENT_TABLE_COLUMNS.SKILL_LEVEL]: data.skill_level,
        [STUDENT_TABLE_COLUMNS.STATUS]: STUDENT_STATUS.ACTIVE, // Default to active
        [STUDENT_TABLE_COLUMNS.SPECIAL_REQUIREMENTS]: data.special_requirements || null,
        [STUDENT_TABLE_COLUMNS.MEDICAL_NOTES]: data.medical_notes || null
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating student:', error)
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.CREATE_ERROR
      }
    }

    return {
      data: newStudent as Student,
      error: null,
      message: STUDENT_SUCCESS_MESSAGES.CREATE_SUCCESS
    }

  } catch (error) {
    console.error('Unexpected error in createNewStudent:', error)
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR
    }
  }
}

/**
 * Updates an existing student record with validation and audit logging
 * 
 * @param id - Student UUID
 * @param data - Partial student form data for updates
 * @returns Promise<StudentApiResponse> - Updated student record
 * 
 * @example
 * ```typescript
 * const result = await updateExistingStudent('student-id', {
 *   skill_level: 'intermediate',
 *   grade_level: '6'
 * })
 * ```
 */
export async function updateExistingStudent(
  id: string,
  data: Partial<StudentFormData>
): Promise<StudentApiResponse> {
  try {
    if (!id || typeof id !== 'string') {
      return {
        data: null,
        error: 'Invalid student ID provided'
      }
    }

    // Validate provided data
    if (Object.keys(data).length === 0) {
      return {
        data: null,
        error: 'No update data provided'
      }
    }

    // Partial validation for provided fields only
    const validationError = validateStudentData(data, true)
    if (validationError) {
      return {
        data: null,
        error: validationError
      }
    }

    // Check if student exists and user has permission (RLS will handle this)
    const { data: existingStudent } = await supabase
      .from(DATABASE_TABLES.STUDENTS)
      .select(STUDENT_TABLE_COLUMNS.ID)
      .eq(STUDENT_TABLE_COLUMNS.ID, id)
      .single()

    if (!existingStudent) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.NOT_FOUND
      }
    }

    // Prepare update object with only provided fields
    const updateData: Partial<Record<string, string | null>> = {}
    
    if (data.full_name !== undefined) updateData[STUDENT_TABLE_COLUMNS.FULL_NAME] = data.full_name
    if (data.date_of_birth !== undefined) updateData[STUDENT_TABLE_COLUMNS.DATE_OF_BIRTH] = data.date_of_birth
    if (data.school_name !== undefined) updateData[STUDENT_TABLE_COLUMNS.SCHOOL_NAME] = data.school_name
    if (data.grade_level !== undefined) updateData[STUDENT_TABLE_COLUMNS.GRADE_LEVEL] = data.grade_level
    if (data.parent_name !== undefined) updateData[STUDENT_TABLE_COLUMNS.PARENT_NAME] = data.parent_name
    if (data.parent_email !== undefined) updateData[STUDENT_TABLE_COLUMNS.PARENT_EMAIL] = data.parent_email
    if (data.parent_phone !== undefined) updateData[STUDENT_TABLE_COLUMNS.PARENT_PHONE] = data.parent_phone
    if (data.emergency_contact_name !== undefined) updateData[STUDENT_TABLE_COLUMNS.EMERGENCY_CONTACT_NAME] = data.emergency_contact_name || null
    if (data.emergency_contact_phone !== undefined) updateData[STUDENT_TABLE_COLUMNS.EMERGENCY_CONTACT_PHONE] = data.emergency_contact_phone || null
    if (data.skill_level !== undefined) updateData[STUDENT_TABLE_COLUMNS.SKILL_LEVEL] = data.skill_level
    if (data.special_requirements !== undefined) updateData[STUDENT_TABLE_COLUMNS.SPECIAL_REQUIREMENTS] = data.special_requirements || null
    if (data.medical_notes !== undefined) updateData[STUDENT_TABLE_COLUMNS.MEDICAL_NOTES] = data.medical_notes || null

    // Update student (updated_by and updated_at set by database trigger)
    const { data: updatedStudent, error } = await supabase
      .from(DATABASE_TABLES.STUDENTS)
      .update(updateData)
      .eq(STUDENT_TABLE_COLUMNS.ID, id)
      .select()
      .single()

    if (error) {
      console.error('Error updating student:', error)
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.UPDATE_ERROR
      }
    }

    return {
      data: updatedStudent as Student,
      error: null,
      message: STUDENT_SUCCESS_MESSAGES.UPDATE_SUCCESS
    }

  } catch (error) {
    console.error('Unexpected error in updateExistingStudent:', error)
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR
    }
  }
}

/**
 * Deletes a student record (soft delete by updating status or hard delete based on RLS)
 * 
 * @param id - Student UUID
 * @returns Promise<StudentApiResponse> - Success/error response
 * 
 * @example
 * ```typescript
 * const result = await deleteStudentRecord('student-id')
 * ```
 */
export async function deleteStudentRecord(id: string): Promise<StudentApiResponse> {
  try {
    if (!id || typeof id !== 'string') {
      return {
        data: null,
        error: 'Invalid student ID provided'
      }
    }

    // Check if student exists and user has permission (RLS will handle permission)
    const { data: existingStudent } = await supabase
      .from(DATABASE_TABLES.STUDENTS)
      .select('*')
      .eq(STUDENT_TABLE_COLUMNS.ID, id)
      .single()

    if (!existingStudent) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.NOT_FOUND
      }
    }

    // Perform hard delete (RLS policies control who can delete)
    // Audit log will be created by database trigger before deletion
    const { error } = await supabase
      .from(DATABASE_TABLES.STUDENTS)
      .delete()
      .eq(STUDENT_TABLE_COLUMNS.ID, id)

    if (error) {
      console.error('Error deleting student:', error)
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.DELETE_ERROR
      }
    }

    return {
      data: null,
      error: null,
      message: STUDENT_SUCCESS_MESSAGES.DELETE_SUCCESS
    }

  } catch (error) {
    console.error('Unexpected error in deleteStudentRecord:', error)
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR
    }
  }
}

// ============================================================================
// SEARCH AND FILTER OPERATIONS
// ============================================================================

/**
 * Advanced search with comprehensive filtering and text search capabilities
 * 
 * @param filters - Comprehensive search and filter parameters
 * @returns Promise<StudentApiResponse> - Filtered and paginated student results
 * 
 * @example
 * ```typescript
 * const result = await searchStudentsWithFilters({
 *   search: 'john elementary',
 *   status: 'active',
 *   skill_level: 'beginner',
 *   age_min: 8,
 *   age_max: 12
 * })
 * ```
 */
export async function searchStudentsWithFilters(
  filters: StudentSearchFilters
): Promise<StudentApiResponse> {
  // This function is essentially the same as fetchAllStudents with filters
  // but provides a more explicit name for search operations
  return await fetchAllStudents(filters)
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk imports multiple students with validation and error reporting
 * 
 * @param students - Array of student form data objects
 * @returns Promise<StudentBulkResponse> - Detailed results of bulk import
 * 
 * @example
 * ```typescript
 * const result = await bulkImportStudents([
 *   { full_name: 'John Doe', ... },
 *   { full_name: 'Jane Smith', ... }
 * ])
 * ```
 */
export async function bulkImportStudents(
  students: StudentFormData[]
): Promise<StudentBulkResponse> {
  try {
    if (!Array.isArray(students) || students.length === 0) {
      return {
        success: [],
        errors: [],
        total_processed: 0,
        total_success: 0,
        total_errors: 0
      }
    }

    const results: StudentBulkResponse = {
      success: [],
      errors: [],
      total_processed: students.length,
      total_success: 0,
      total_errors: 0
    }

    // Process students in batches to avoid overwhelming the database
    const batchSize = 10
    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize)
      
      for (let j = 0; j < batch.length; j++) {
        const studentData = batch[j]
        const index = i + j

        try {
          // Validate student data
          const validationError = validateStudentData(studentData)
          if (validationError) {
            results.errors.push({
              data: studentData,
              error: validationError,
              index
            })
            continue
          }

          // Create student
          const createResult = await createNewStudent(studentData)
          
          if (createResult.error || !createResult.data) {
            results.errors.push({
              data: studentData,
              error: createResult.error || 'Unknown error',
              index
            })
          } else if (!Array.isArray(createResult.data)) {
            // createNewStudent returns a single Student, not an array
            results.success.push(createResult.data)
          }

        } catch (error) {
          results.errors.push({
            data: studentData,
            error: error instanceof Error ? error.message : 'Unknown error',
            index
          })
        }
      }
    }

    results.total_success = results.success.length
    results.total_errors = results.errors.length

    return results

  } catch (error) {
    console.error('Unexpected error in bulkImportStudents:', error)
    return {
      success: [],
      errors: [{
        data: {} as StudentFormData,
        error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
        index: 0
      }],
      total_processed: students.length,
      total_success: 0,
      total_errors: students.length
    }
  }
}

/**
 * Exports student data to CSV format with optional filtering
 * 
 * @param filters - Optional filters to apply before export
 * @returns Promise<Blob> - CSV file as downloadable blob
 * 
 * @example
 * ```typescript
 * const csvBlob = await exportStudentsToCSV({
 *   status: 'active',
 *   school_name: 'Lincoln Elementary'
 * })
 * ```
 */
export async function exportStudentsToCSV(
  filters?: StudentSearchFilters
): Promise<Blob> {
  try {
    // Fetch all students matching the filters (without pagination)
    const exportFilters = {
      ...filters,
      limit: 10000, // Large limit to get all records
      page: 1
    }

    const result = await fetchAllStudents(exportFilters)
    
    if (result.error || !result.data) {
      throw new Error(result.error || 'Failed to fetch student data')
    }

    // Ensure we have an array of students
    if (!Array.isArray(result.data)) {
      throw new Error('Expected array of students')
    }
    
    const students = result.data

    // Define CSV headers
    const headers = [
      'ID',
      'Full Name',
      'Parent Name',
      'Date of Birth',
      'School Name',
      'Grade Level',
      'Parent Email',
      'Parent Phone',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Skill Level',
      'Status',
      'Special Requirements',
      'Medical Notes',
      'Created At',
      'Updated At'
    ]

    // Convert students to CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...students.map(student => [
        `"${student.id}"`,
        `"${student.full_name}"`,
        `"${(student as any).parent_name || ''}"`,
        `"${student.date_of_birth}"`,
        `"${student.school_name}"`,
        `"${student.grade_level}"`,
        `"${student.parent_email}"`,
        `"${student.parent_phone}"`,
        `"${student.emergency_contact_name || ''}"`,
        `"${student.emergency_contact_phone || ''}"`,
        `"${student.skill_level}"`,
        `"${student.status}"`,
        `"${student.special_requirements || ''}"`,
        `"${student.medical_notes || ''}"`,
        `"${student.created_at}"`,
        `"${student.updated_at}"`
      ].join(','))
    ]

    // Create CSV content
    const csvContent = csvRows.join('\n')
    
    // Create and return blob
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  } catch (error) {
    console.error('Error exporting students to CSV:', error)
    // Return empty CSV with headers only on error
    const headers = ['Error']
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const csvContent = `${headers.join(',')}\n"${errorMessage}"`
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  }
}

// ============================================================================
// STATISTICS AND ANALYTICS
// ============================================================================

/**
 * Fetches comprehensive student statistics for dashboard and analytics
 * 
 * @returns Promise<ServiceResponse<StudentStatistics>> - Student statistics summary
 * 
 * @example
 * ```typescript
 * const stats = await getStudentStatistics()
 * ```
 */
export async function getStudentStatistics(): Promise<ServiceResponse<StudentStatistics>> {
  try {
    // Fetch all students for analysis
    const { data: students, error } = await supabase
      .from(DATABASE_TABLES.STUDENTS)
      .select('*')

    if (error) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.FETCH_ERROR,
        success: false
      }
    }

    if (!students) {
      return {
        data: null,
        error: 'No student data available',
        success: false
      }
    }

    // Calculate statistics
    const stats: StudentStatistics = {
      total_students: students.length,
      active_students: students.filter(s => s.status === STUDENT_STATUS.ACTIVE).length,
      inactive_students: students.filter(s => s.status === STUDENT_STATUS.INACTIVE).length,
      suspended_students: students.filter(s => s.status === STUDENT_STATUS.SUSPENDED).length,
      graduated_students: students.filter(s => s.status === STUDENT_STATUS.GRADUATED).length,
      students_by_skill_level: {
        beginner: students.filter(s => s.skill_level === STUDENT_SKILL_LEVELS.BEGINNER).length,
        intermediate: students.filter(s => s.skill_level === STUDENT_SKILL_LEVELS.INTERMEDIATE).length,
        advanced: students.filter(s => s.skill_level === STUDENT_SKILL_LEVELS.ADVANCED).length
      },
      students_by_grade: {},
      students_by_school: {},
      recent_enrollments: 0, // Would need enrollment data
      average_age: 0
    }

    // Calculate grade distribution
    students.forEach(student => {
      const grade = student.grade_level
      stats.students_by_grade[grade] = (stats.students_by_grade[grade] || 0) + 1
    })

    // Calculate school distribution
    students.forEach(student => {
      const school = student.school_name
      stats.students_by_school[school] = (stats.students_by_school[school] || 0) + 1
    })

    // Calculate average age
    const currentDate = new Date()
    const totalAge = students.reduce((sum, student) => {
      const birthDate = new Date(student.date_of_birth)
      const age = currentDate.getFullYear() - birthDate.getFullYear()
      return sum + age
    }, 0)
    stats.average_age = students.length > 0 ? Math.round(totalAge / students.length) : 0

    return {
      data: stats,
      error: null,
      success: true
    }

  } catch (error) {
    console.error('Error fetching student statistics:', error)
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      success: false
    }
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates student form data against database constraints and business rules
 * 
 * @param data - Student form data to validate
 * @param isPartialUpdate - Whether this is a partial update (optional fields allowed)
 * @returns string | null - Error message or null if valid
 */
function validateStudentData(data: Partial<StudentFormData>, isPartialUpdate = false): string | null {
  // Required field validation (skip for partial updates)
  if (!isPartialUpdate) {
    if (!data.full_name?.trim()) return 'Full name is required'
    if (!data.date_of_birth) return 'Date of birth is required'
    if (!data.school_name?.trim()) return 'School name is required'
    if (!data.grade_level) return 'Grade level is required'
    if (!data.parent_email?.trim()) return 'Parent email is required'
    if (!data.parent_phone?.trim()) return 'Parent phone is required'
    if (!data.skill_level) return 'Skill level is required'
  }

  // Validate individual fields when provided
  if (data.full_name !== undefined) {
    if (data.full_name.trim().length < VALIDATION_RULES.STUDENT_NAME_MIN_LENGTH) {
      return 'Full name must be at least 2 characters long'
    }
    if (data.full_name.length > VALIDATION_RULES.STUDENT_NAME_MAX_LENGTH) {
      return 'Full name cannot exceed 255 characters'
    }
  }

  if (data.school_name !== undefined) {
    if (data.school_name.trim().length < VALIDATION_RULES.SCHOOL_NAME_MIN_LENGTH) {
      return 'School name must be at least 2 characters long'
    }
    if (data.school_name.length > VALIDATION_RULES.SCHOOL_NAME_MAX_LENGTH) {
      return 'School name cannot exceed 255 characters'
    }
  }

  if (data.parent_email !== undefined) {
    if (!VALIDATION_RULES.EMAIL_REGEX.test(data.parent_email)) {
      return 'Please enter a valid email address'
    }
  }

  if (data.parent_phone !== undefined) {
    if (!VALIDATION_RULES.PHONE_REGEX.test(data.parent_phone)) {
      return 'Please enter a valid phone number'
    }
  }

  if (data.emergency_contact_phone !== undefined && data.emergency_contact_phone) {
    if (!VALIDATION_RULES.PHONE_REGEX.test(data.emergency_contact_phone)) {
      return 'Please enter a valid emergency contact phone number'
    }
  }

  if (data.grade_level !== undefined) {
    if (!VALIDATION_RULES.GRADE_LEVEL_REGEX.test(data.grade_level)) {
      return 'Please select a valid grade level (K, 1-12)'
    }
  }

  if (data.date_of_birth !== undefined) {
    const birthDate = new Date(data.date_of_birth)
    const currentDate = new Date()
    const age = currentDate.getFullYear() - birthDate.getFullYear()
    
    if (age < VALIDATION_RULES.MIN_STUDENT_AGE || age > VALIDATION_RULES.MAX_STUDENT_AGE) {
      return STUDENT_ERROR_MESSAGES.AGE_VALIDATION_ERROR
    }
  }

  if (data.skill_level !== undefined) {
    if (!Object.values(STUDENT_SKILL_LEVELS).includes(data.skill_level as SkillLevel)) {
      return 'Please select a valid skill level'
    }
  }

  if (data.special_requirements !== undefined && data.special_requirements) {
    if (data.special_requirements.length > VALIDATION_RULES.SPECIAL_REQUIREMENTS_MAX_LENGTH) {
      return 'Special requirements cannot exceed 1000 characters'
    }
  }

  if (data.medical_notes !== undefined && data.medical_notes) {
    if (data.medical_notes.length > VALIDATION_RULES.MEDICAL_NOTES_MAX_LENGTH) {
      return 'Medical notes cannot exceed 1000 characters'
    }
  }

  return null // No validation errors
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { ServiceResponse }
