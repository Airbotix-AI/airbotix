/**
 * Custom React Hooks for Student Management
 * State management and data fetching with optimistic updates
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Student,
  StudentFormData,
  StudentSearchFilters,
  StudentListParams,
  StudentProgress,
  StudentStatistics,
  StudentImportResult
} from '../types/student.types';
import {
  fetchAllStudents,
  fetchStudentById,
  createNewStudent,
  updateExistingStudent,
  deleteStudentRecord,
  searchStudentsWithFilters,
  bulkImportStudents,
  exportStudentsToCSV,
  getStudentStatistics,
  validateStudentFormData,
  type ServiceResponse
} from '../services/student.service';
import {
  STUDENT_ERROR_MESSAGES,
  STUDENT_SUCCESS_MESSAGES,
  DEFAULT_PAGINATION
} from '../constants/student.constants';

// ============================================================================
// HOOK RETURN INTERFACES
// ============================================================================

export interface UseStudentsListReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  refetch: () => void;
  createStudent: (data: StudentFormData) => Promise<{ success: boolean; error?: string }>;
  updateStudent: (id: string, data: Partial<StudentFormData>) => Promise<{ success: boolean; error?: string }>;
  deleteStudent: (id: string) => Promise<{ success: boolean; error?: string }>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: StudentSearchFilters) => void;
  setSearch: (search: string) => void;
}

export interface UseStudentDetailsReturn {
  student: Student | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateStudent: (data: Partial<StudentFormData>) => Promise<{ success: boolean; error?: string }>;
  deleteStudent: () => Promise<{ success: boolean; error?: string }>;
}

export interface UseStudentSearchReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  search: (filters: StudentSearchFilters) => void;
  clearSearch: () => void;
  debouncedSearch: (filters: StudentSearchFilters) => void;
}

export interface UseStudentFormReturn {
  formData: StudentFormData;
  errors: Record<string, string>;
  loading: boolean;
  setFormData: (data: Partial<StudentFormData>) => void;
  setField: (field: keyof StudentFormData, value: string) => void;
  validate: () => boolean;
  reset: () => void;
  submit: (onSuccess?: (student: Student) => void) => Promise<{ success: boolean; error?: string }>;
}

export interface UseStudentBulkOperationsReturn {
  importLoading: boolean;
  exportLoading: boolean;
  importResult: StudentImportResult | null;
  importStudents: (students: StudentFormData[]) => Promise<{ success: boolean; error?: string }>;
  exportStudents: (filters?: StudentSearchFilters) => Promise<{ success: boolean; data?: string; error?: string }>;
  clearImportResult: () => void;
}

// ============================================================================
// STUDENTS LIST HOOK
// ============================================================================

/**
 * Hook for managing students list with pagination and CRUD operations
 * @param initialParams - Initial list parameters
 * @returns UseStudentsListReturn
 */
export function useStudentsList(initialParams: StudentListParams = {}): UseStudentsListReturn {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState<StudentListParams>({
    page: DEFAULT_PAGINATION.PAGE,
    limit: DEFAULT_PAGINATION.LIMIT,
    ...initialParams
  });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAllStudents(params);
      
      if (response.success && response.data) {
        setStudents(response.data.data);
        setTotal(response.data.total);
      } else {
        setError(response.error || STUDENT_ERROR_MESSAGES.SERVER_ERROR);
        setStudents([]);
        setTotal(0);
      }
    } catch (err) {
      setError(STUDENT_ERROR_MESSAGES.NETWORK_ERROR);
      setStudents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const createStudent = useCallback(async (data: StudentFormData) => {
    setLoading(true);
    
    try {
      const response = await createNewStudent(data);
      
      if (response.success && response.data) {
        // Optimistic update - add to beginning of list
        setStudents(prev => [response.data!, ...prev]);
        setTotal(prev => prev + 1);
        return { success: true };
      } else {
        return { success: false, error: response.error || STUDENT_ERROR_MESSAGES.STUDENT_CREATE_FAILED };
      }
    } catch (err) {
      return { success: false, error: STUDENT_ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (id: string, data: Partial<StudentFormData>) => {
    setLoading(true);
    
    try {
      const response = await updateExistingStudent(id, data);
      
      if (response.success && response.data) {
        // Optimistic update - replace in list
        setStudents(prev => prev.map(student => 
          student.id === id ? response.data! : student
        ));
        return { success: true };
      } else {
        return { success: false, error: response.error || STUDENT_ERROR_MESSAGES.STUDENT_UPDATE_FAILED };
      }
    } catch (err) {
      return { success: false, error: STUDENT_ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStudent = useCallback(async (id: string) => {
    setLoading(true);
    
    try {
      const response = await deleteStudentRecord(id);
      
      if (response.success) {
        // Optimistic update - remove from list
        setStudents(prev => prev.filter(student => student.id !== id));
        setTotal(prev => prev - 1);
        return { success: true };
      } else {
        return { success: false, error: response.error || STUDENT_ERROR_MESSAGES.STUDENT_DELETE_FAILED };
      }
    } catch (err) {
      return { success: false, error: STUDENT_ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setLoading(false);
    }
  }, []);

  const setPage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setParams(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: StudentSearchFilters) => {
    setParams(prev => ({ ...prev, filters, page: 1 }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setParams(prev => ({ ...prev, search, page: 1 }));
  }, []);

  return {
    students,
    loading,
    error,
    total,
    page: params.page || DEFAULT_PAGINATION.PAGE,
    limit: params.limit || DEFAULT_PAGINATION.LIMIT,
    refetch: fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    setPage,
    setLimit,
    setFilters,
    setSearch
  };
}

// ============================================================================
// STUDENT DETAILS HOOK
// ============================================================================

/**
 * Hook for managing a single student's details
 * @param id - Student ID
 * @returns UseStudentDetailsReturn
 */
export function useStudentDetails(id: string): UseStudentDetailsReturn {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = useCallback(async () => {
    if (!id) {
      setStudent(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchStudentById(id);
      
      if (response.success && response.data) {
        setStudent(response.data);
      } else {
        setError(response.error || STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND);
        setStudent(null);
      }
    } catch (err) {
      setError(STUDENT_ERROR_MESSAGES.NETWORK_ERROR);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const updateStudent = useCallback(async (data: Partial<StudentFormData>) => {
    if (!id) return { success: false, error: STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND };

    setLoading(true);
    
    try {
      const response = await updateExistingStudent(id, data);
      
      if (response.success && response.data) {
        setStudent(response.data);
        return { success: true };
      } else {
        return { success: false, error: response.error || STUDENT_ERROR_MESSAGES.STUDENT_UPDATE_FAILED };
      }
    } catch (err) {
      return { success: false, error: STUDENT_ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setLoading(false);
    }
  }, [id]);

  const deleteStudent = useCallback(async () => {
    if (!id) return { success: false, error: STUDENT_ERROR_MESSAGES.STUDENT_NOT_FOUND };

    setLoading(true);
    
    try {
      const response = await deleteStudentRecord(id);
      
      if (response.success) {
        setStudent(null);
        return { success: true };
      } else {
        return { success: false, error: response.error || STUDENT_ERROR_MESSAGES.STUDENT_DELETE_FAILED };
      }
    } catch (err) {
      return { success: false, error: STUDENT_ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    student,
    loading,
    error,
    refetch: fetchStudent,
    updateStudent,
    deleteStudent
  };
}

// ============================================================================
// STUDENT SEARCH HOOK
// ============================================================================

/**
 * Hook for student search functionality with debouncing
 * @returns UseStudentSearchReturn
 */
export function useStudentSearch(): UseStudentSearchReturn {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const search = useCallback(async (filters: StudentSearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchStudentsWithFilters(filters);
      
      if (response.success && response.data) {
        setStudents(response.data);
      } else {
        setError(response.error || STUDENT_ERROR_MESSAGES.SERVER_ERROR);
        setStudents([]);
      }
    } catch (err) {
      setError(STUDENT_ERROR_MESSAGES.NETWORK_ERROR);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((filters: StudentSearchFilters) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      search(filters);
    }, 300);

    setSearchTimeout(timeout);
  }, [search, searchTimeout]);

  const clearSearch = useCallback(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
    setStudents([]);
    setError(null);
    setLoading(false);
  }, [searchTimeout]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return {
    students,
    loading,
    error,
    search,
    clearSearch,
    debouncedSearch
  };
}

// ============================================================================
// STUDENT FORM HOOK
// ============================================================================

/**
 * Hook for managing student form state and validation
 * @param initialData - Initial form data (for editing)
 * @returns UseStudentFormReturn
 */
export function useStudentForm(initialData?: Student): UseStudentFormReturn {
  const [formData, setFormDataState] = useState<StudentFormData>(() => ({
    name: initialData?.name || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    school: initialData?.school || '',
    grade: initialData?.grade || '',
    parentEmail: initialData?.parentEmail || '',
    parentPhone: initialData?.parentPhone || '',
    emergencyContactName: initialData?.emergencyContactName || '',
    emergencyContactPhone: initialData?.emergencyContactPhone || '',
    emergencyContactRelation: initialData?.emergencyContactRelation || '',
    skillLevel: initialData?.skillLevel || '',
    status: initialData?.status || '',
    specialRequirements: initialData?.specialRequirements || '',
    progressComments: initialData?.progressComments || '',
    medicalNotes: initialData?.medicalNotes || ''
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const setFormData = useCallback((data: Partial<StudentFormData>) => {
    setFormDataState(prev => ({ ...prev, ...data }));
    // Clear errors when form data changes
    setErrors({});
  }, []);

  const setField = useCallback((field: keyof StudentFormData, value: string) => {
    setFormDataState(prev => ({ ...prev, [field]: value }));
    // Clear specific field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const validationErrors = validateStudentFormData(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const reset = useCallback(() => {
    setFormDataState({
      name: '',
      dateOfBirth: '',
      school: '',
      grade: '',
      parentEmail: '',
      parentPhone: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      skillLevel: '',
      status: '',
      specialRequirements: '',
      progressComments: '',
      medicalNotes: ''
    });
    setErrors({});
  }, []);

  const submit = useCallback(async (onSuccess?: (student: Student) => void) => {
    if (!validate()) {
      return { success: false, error: 'Please fix validation errors' };
    }

    setLoading(true);

    try {
      const response = initialData 
        ? await updateExistingStudent(initialData.id, formData)
        : await createNewStudent(formData);

      if (response.success && response.data) {
        onSuccess?.(response.data);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Operation failed' };
      }
    } catch (err) {
      return { success: false, error: STUDENT_ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setLoading(false);
    }
  }, [formData, initialData, validate]);

  return {
    formData,
    errors,
    loading,
    setFormData,
    setField,
    validate,
    reset,
    submit
  };
}

// ============================================================================
// BULK OPERATIONS HOOK
// ============================================================================

/**
 * Hook for managing bulk import/export operations
 * @returns UseStudentBulkOperationsReturn
 */
export function useStudentBulkOperations(): UseStudentBulkOperationsReturn {
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [importResult, setImportResult] = useState<StudentImportResult | null>(null);

  const importStudents = useCallback(async (students: StudentFormData[]) => {
    setImportLoading(true);
    setImportResult(null);

    try {
      const response = await bulkImportStudents(students);
      
      if (response.success && response.data) {
        setImportResult(response.data);
        return { success: true };
      } else {
        return { success: false, error: response.error || STUDENT_ERROR_MESSAGES.BULK_IMPORT_FAILED };
      }
    } catch (err) {
      return { success: false, error: STUDENT_ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setImportLoading(false);
    }
  }, []);

  const exportStudents = useCallback(async (filters?: StudentSearchFilters) => {
    setExportLoading(true);

    try {
      const response = await exportStudentsToCSV(filters);
      
      if (response.success && response.data) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || STUDENT_ERROR_MESSAGES.BULK_EXPORT_FAILED };
      }
    } catch (err) {
      return { success: false, error: STUDENT_ERROR_MESSAGES.NETWORK_ERROR };
    } finally {
      setExportLoading(false);
    }
  }, []);

  const clearImportResult = useCallback(() => {
    setImportResult(null);
  }, []);

  return {
    importLoading,
    exportLoading,
    importResult,
    importStudents,
    exportStudents,
    clearImportResult
  };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook for student statistics
 * @returns Statistics data with loading state
 */
export function useStudentStatistics() {
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getStudentStatistics();
      
      if (response.success && response.data) {
        setStatistics(response.data);
      } else {
        setError(response.error || STUDENT_ERROR_MESSAGES.SERVER_ERROR);
      }
    } catch (err) {
      setError(STUDENT_ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  };
}
