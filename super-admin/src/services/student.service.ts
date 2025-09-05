/**
 * Student Management Service Functions
 * Supabase CRUD operations with proper error handling and TypeScript types
 */

import { supabase, type Database } from '../lib/supabase';
import type {
  Student,
  StudentFormData,
  StudentSearchFilters,
  StudentListParams,
  StudentStatistics,
  StudentImportResult
} from '../types/student.types';
import {
  STUDENT_ERROR_MESSAGES,
  DEFAULT_PAGINATION,
  type SkillLevelType,
  type StudentStatusType
} from '../constants/student.constants';

// ============================================================================
// SERVICE RESPONSE INTERFACE
// ============================================================================

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// ============================================================================
// DATABASE MAPPING UTILITIES
// ============================================================================

type DatabaseStudent = Database['public']['Tables']['students']['Row'];

/**
 * Convert database student row to our Student interface
 */
function mapDatabaseStudentToStudent(dbStudent: DatabaseStudent): Student {
  return {
    id: dbStudent.id,
    name: dbStudent.name,
    dateOfBirth: dbStudent.date_of_birth,
    school: dbStudent.school,
    grade: dbStudent.grade,
    parentEmail: dbStudent.parent_email,
    parentPhone: dbStudent.parent_phone,
    emergencyContactName: dbStudent.emergency_contact_name,
    emergencyContactPhone: dbStudent.emergency_contact_phone,
    emergencyContactRelation: dbStudent.emergency_contact_relation,
    enrolledCourses: [], // TODO: Implement when course relationships are added
    completedWorkshops: [], // TODO: Implement when workshop relationships are added
    skillLevel: dbStudent.skill_level as SkillLevelType,
    status: dbStudent.status as StudentStatusType,
    specialRequirements: dbStudent.special_requirements,
    progressComments: dbStudent.progress_comments,
    medicalNotes: dbStudent.medical_notes,
    createdBy: '', // TODO: Add created_by field to database
    updatedBy: '', // TODO: Add updated_by field to database
    createdAt: dbStudent.created_at,
    updatedAt: dbStudent.updated_at
  };
}

// ============================================================================
// CORE CRUD OPERATIONS
// ============================================================================

/**
 * Fetch all students with pagination and filtering
 * @param params - List parameters including filters, sorting, and pagination
 * @returns Promise<ServiceResponse<PaginatedResponse<Student>>>
 */
export async function fetchAllStudents(
  params: StudentListParams = {}
): Promise<ServiceResponse<{ data: Student[]; total: number; page: number; limit: number }>> {
  try {
    const {
      page = DEFAULT_PAGINATION.PAGE,
      limit = DEFAULT_PAGINATION.LIMIT,
      filters = {},
      sort = { field: 'createdAt', direction: 'desc' as const },
      search
    } = params;

    let query = supabase
      .from('students')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,school.ilike.%${search}%,parent_email.ilike.%${search}%`);
    }

    // Apply individual filters
    if (filters.name) {
      query = query.ilike('name', `%${filters.name}%`);
    }
    if (filters.school) {
      query = query.ilike('school', `%${filters.school}%`);
    }
    if (filters.grade) {
      query = query.eq('grade', filters.grade);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.skillLevel) {
      query = query.eq('skill_level', filters.skillLevel);
    }

    // Apply age range filter
    if (filters.ageRange) {
      const { min, max } = filters.ageRange;
      const currentDate = new Date();
      const maxBirthDate = new Date(currentDate.getFullYear() - min, currentDate.getMonth(), currentDate.getDate());
      const minBirthDate = new Date(currentDate.getFullYear() - max, currentDate.getMonth(), currentDate.getDate());
      
      query = query
        .lte('date_of_birth', maxBirthDate.toISOString())
        .gte('date_of_birth', minBirthDate.toISOString());
    }

    // Apply date range filter
    if (filters.createdDateRange) {
      query = query
        .gte('created_at', filters.createdDateRange.start)
        .lte('created_at', filters.createdDateRange.end);
    }

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching students:', error);
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.STUDENT_CREATE_FAILED,
        success: false
      };
    }

    return {
      data: {
        data: (data || []).map(mapDatabaseStudentToStudent),
        total: count || 0,
        page,
        limit
      },
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error in fetchAllStudents:', error);
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      success: false
    };
  }
}

/**
 * Fetch a single student by ID
 * @param id - Student ID
 * @returns Promise<ServiceResponse<Student>>
 */
export async function fetchStudentById(id: string): Promise<ServiceResponse<Student>> {
  try {
    if (!id) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND,
        success: false
      };
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching student:', error);
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND,
        success: false
      };
    }

    return {
      data: mapDatabaseStudentToStudent(data),
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error in fetchStudentById:', error);
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      success: false
    };
  }
}

/**
 * Create a new student record
 * @param studentData - Student form data
 * @returns Promise<ServiceResponse<Student>>
 */
export async function createNewStudent(studentData: StudentFormData): Promise<ServiceResponse<Student>> {
  try {
    // Validate required fields
    if (!studentData.name || !studentData.parentEmail) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.NAME_REQUIRED,
        success: false
      };
    }

    // Check for duplicate student
    const { data: existingStudent } = await supabase
      .from('students')
      .select('id')
      .eq('name', studentData.name)
      .eq('parent_email', studentData.parentEmail)
      .single();

    if (existingStudent) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.STUDENT_ALREADY_EXISTS,
        success: false
      };
    }

    const { data, error } = await supabase
      .from('students')
      .insert([{
        name: studentData.name,
        date_of_birth: studentData.dateOfBirth,
        school: studentData.school,
        grade: studentData.grade,
        parent_email: studentData.parentEmail,
        parent_phone: studentData.parentPhone,
        emergency_contact_name: studentData.emergencyContactName,
        emergency_contact_phone: studentData.emergencyContactPhone,
        emergency_contact_relation: studentData.emergencyContactRelation,
        skill_level: studentData.skillLevel,
        status: studentData.status,
        special_requirements: studentData.specialRequirements,
        progress_comments: studentData.progressComments,
        medical_notes: studentData.medicalNotes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating student:', error);
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.STUDENT_CREATE_FAILED,
        success: false
      };
    }

    return {
      data: mapDatabaseStudentToStudent(data),
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error in createNewStudent:', error);
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      success: false
    };
  }
}

/**
 * Update an existing student record
 * @param id - Student ID
 * @param updateData - Partial student form data
 * @returns Promise<ServiceResponse<Student>>
 */
export async function updateExistingStudent(
  id: string,
  updateData: Partial<StudentFormData>
): Promise<ServiceResponse<Student>> {
  try {
    if (!id) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND,
        success: false
      };
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    // Map form data to database fields
    if (updateData.name !== undefined) updatePayload.name = updateData.name;
    if (updateData.dateOfBirth !== undefined) updatePayload.date_of_birth = updateData.dateOfBirth;
    if (updateData.school !== undefined) updatePayload.school = updateData.school;
    if (updateData.grade !== undefined) updatePayload.grade = updateData.grade;
    if (updateData.parentEmail !== undefined) updatePayload.parent_email = updateData.parentEmail;
    if (updateData.parentPhone !== undefined) updatePayload.parent_phone = updateData.parentPhone;
    if (updateData.emergencyContactName !== undefined) updatePayload.emergency_contact_name = updateData.emergencyContactName;
    if (updateData.emergencyContactPhone !== undefined) updatePayload.emergency_contact_phone = updateData.emergencyContactPhone;
    if (updateData.emergencyContactRelation !== undefined) updatePayload.emergency_contact_relation = updateData.emergencyContactRelation;
    if (updateData.skillLevel !== undefined) updatePayload.skill_level = updateData.skillLevel;
    if (updateData.status !== undefined) updatePayload.status = updateData.status;
    if (updateData.specialRequirements !== undefined) updatePayload.special_requirements = updateData.specialRequirements;
    if (updateData.progressComments !== undefined) updatePayload.progress_comments = updateData.progressComments;
    if (updateData.medicalNotes !== undefined) updatePayload.medical_notes = updateData.medicalNotes;

    const { data, error } = await supabase
      .from('students')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating student:', error);
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.STUDENT_UPDATE_FAILED,
        success: false
      };
    }

    return {
      data: mapDatabaseStudentToStudent(data),
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error in updateExistingStudent:', error);
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      success: false
    };
  }
}

/**
 * Delete a student record
 * @param id - Student ID
 * @returns Promise<ServiceResponse<boolean>>
 */
export async function deleteStudentRecord(id: string): Promise<ServiceResponse<boolean>> {
  try {
    if (!id) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND,
        success: false
      };
    }

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.STUDENT_DELETE_FAILED,
        success: false
      };
    }

    return {
      data: true,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error in deleteStudentRecord:', error);
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      success: false
    };
  }
}

// ============================================================================
// SEARCH AND FILTERING OPERATIONS
// ============================================================================

/**
 * Search students with advanced filters
 * @param filters - Search filter criteria
 * @returns Promise<ServiceResponse<Student[]>>
 */
export async function searchStudentsWithFilters(
  filters: StudentSearchFilters
): Promise<ServiceResponse<Student[]>> {
  try {
    const params: StudentListParams = {
      filters,
      page: 1,
      limit: 1000 // Large limit for search results
    };

    const result = await fetchAllStudents(params);
    
    if (!result.success || !result.data) {
      return {
        data: null,
        error: result.error,
        success: false
      };
    }

    return {
      data: result.data.data,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error in searchStudentsWithFilters:', error);
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      success: false
    };
  }
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk import students from array of form data
 * @param studentsData - Array of student form data
 * @returns Promise<ServiceResponse<StudentImportResult>>
 */
export async function bulkImportStudents(
  studentsData: StudentFormData[]
): Promise<ServiceResponse<StudentImportResult>> {
  try {
    if (!studentsData || studentsData.length === 0) {
      return {
        data: null,
        error: STUDENT_ERROR_MESSAGES.BULK_IMPORT_FAILED,
        success: false
      };
    }

    const successful: Student[] = [];
    const failed: { data: StudentFormData; error: string }[] = [];

    // Process each student individually to handle errors gracefully
    for (let i = 0; i < studentsData.length; i++) {
      const studentData = studentsData[i];
      
      try {
        const result = await createNewStudent(studentData);
        
        if (result.success && result.data) {
          successful.push(result.data);
        } else {
          failed.push({
            data: studentData,
            error: result.error || 'Unknown error'
          });
        }
      } catch (error) {
        failed.push({
          data: studentData,
          error: `Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }

    return {
      data: {
        totalProcessed: studentsData.length,
        successful: successful.length,
        failed: failed.length,
        errors: failed.map((item, index) => ({
          row: index + 1,
          field: 'general',
          message: item.error
        }))
      },
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error in bulkImportStudents:', error);
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      success: false
    };
  }
}

/**
 * Export students to CSV format
 * @param filters - Optional filters for export
 * @returns Promise<ServiceResponse<string>>
 */
export async function exportStudentsToCSV(
  filters?: StudentSearchFilters
): Promise<ServiceResponse<string>> {
  try {
    const result = await searchStudentsWithFilters(filters || {});
    
    if (!result.success || !result.data) {
      return {
        data: null,
        error: result.error,
        success: false
      };
    }

    // Convert students to CSV format
    const headers = [
      'Name',
      'Date of Birth',
      'School',
      'Grade',
      'Parent Email',
      'Parent Phone',
      'Emergency Contact',
      'Emergency Phone',
      'Skill Level',
      'Status',
      'Special Requirements',
      'Progress Comments',
      'Medical Notes',
      'Created At'
    ];

    const csvRows = [
      headers.join(','),
      ...result.data.map(student => [
        `"${student.name}"`,
        `"${student.dateOfBirth}"`,
        `"${student.school}"`,
        `"${student.grade}"`,
        `"${student.parentEmail}"`,
        `"${student.parentPhone}"`,
        `"${student.emergencyContactName}"`,
        `"${student.emergencyContactPhone}"`,
        `"${student.skillLevel}"`,
        `"${student.status}"`,
        `"${student.specialRequirements}"`,
        `"${student.progressComments}"`,
        `"${student.medicalNotes}"`,
        `"${student.createdAt}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');

    return {
      data: csvContent,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error in exportStudentsToCSV:', error);
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.BULK_EXPORT_FAILED,
      success: false
    };
  }
}

// ============================================================================
// STATISTICS AND ANALYTICS
// ============================================================================

/**
 * Get student statistics and analytics
 * @returns Promise<ServiceResponse<StudentStatistics>>
 */
export async function getStudentStatistics(): Promise<ServiceResponse<StudentStatistics>> {
  try {
    // Fetch all students for statistics calculation
    const result = await fetchAllStudents({ page: 1, limit: 10000 });
    
    if (!result.success || !result.data) {
      return {
        data: null,
        error: result.error,
        success: false
      };
    }

    const students = result.data.data;
    
    // Calculate statistics
    const stats: StudentStatistics = {
      total: students.length,
      active: students.filter(s => s.status === 'active').length,
      inactive: students.filter(s => s.status === 'inactive').length,
      graduated: students.filter(s => s.status === 'graduated').length,
      byGrade: {},
      bySkillLevel: {},
      bySchool: {},
      averageAge: 0,
      enrollmentTrends: []
    };

    // Calculate age and group statistics
    let totalAge = 0;
    let validAges = 0;

    students.forEach(student => {
      // Grade statistics
      stats.byGrade[student.grade] = (stats.byGrade[student.grade] || 0) + 1;
      
      // Skill level statistics
      stats.bySkillLevel[student.skillLevel] = (stats.bySkillLevel[student.skillLevel] || 0) + 1;
      
      // School statistics
      stats.bySchool[student.school] = (stats.bySchool[student.school] || 0) + 1;
      
      // Age calculation
      if (student.dateOfBirth) {
        const birthDate = new Date(student.dateOfBirth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age > 0 && age < 100) {
          totalAge += age;
          validAges++;
        }
      }
    });

    stats.averageAge = validAges > 0 ? Math.round(totalAge / validAges) : 0;

    return {
      data: stats,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Unexpected error in getStudentStatistics:', error);
    return {
      data: null,
      error: STUDENT_ERROR_MESSAGES.SERVER_ERROR,
      success: false
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate student form data
 * @param data - Student form data to validate
 * @returns Object with validation errors
 */
export function validateStudentFormData(data: StudentFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = STUDENT_ERROR_MESSAGES.NAME_TOO_SHORT;
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = STUDENT_ERROR_MESSAGES.DATE_OF_BIRTH_REQUIRED;
  } else {
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    if (birthDate > today) {
      errors.dateOfBirth = STUDENT_ERROR_MESSAGES.DATE_OF_BIRTH_FUTURE;
    }
  }

  if (!data.school || data.school.trim().length === 0) {
    errors.school = STUDENT_ERROR_MESSAGES.SCHOOL_REQUIRED;
  }

  if (!data.grade) {
    errors.grade = STUDENT_ERROR_MESSAGES.GRADE_REQUIRED;
  }

  if (!data.parentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.parentEmail)) {
    errors.parentEmail = STUDENT_ERROR_MESSAGES.PARENT_EMAIL_INVALID;
  }

  if (!data.parentPhone || data.parentPhone.trim().length < 10) {
    errors.parentPhone = STUDENT_ERROR_MESSAGES.PARENT_PHONE_INVALID;
  }

  if (!data.emergencyContactName || data.emergencyContactName.trim().length === 0) {
    errors.emergencyContactName = STUDENT_ERROR_MESSAGES.EMERGENCY_CONTACT_NAME_REQUIRED;
  }

  if (!data.emergencyContactPhone || data.emergencyContactPhone.trim().length < 10) {
    errors.emergencyContactPhone = STUDENT_ERROR_MESSAGES.EMERGENCY_CONTACT_PHONE_INVALID;
  }

  if (!data.emergencyContactRelation || data.emergencyContactRelation.trim().length === 0) {
    errors.emergencyContactRelation = STUDENT_ERROR_MESSAGES.EMERGENCY_CONTACT_RELATION_REQUIRED;
  }

  if (!data.skillLevel) {
    errors.skillLevel = STUDENT_ERROR_MESSAGES.SKILL_LEVEL_REQUIRED;
  }

  if (!data.status) {
    errors.status = STUDENT_ERROR_MESSAGES.STATUS_REQUIRED;
  }

  return errors;
}
