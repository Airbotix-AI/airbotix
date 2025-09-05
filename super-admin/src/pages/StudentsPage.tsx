/**
 * Students Management Page
 * Main page combining all student management components with modal dialogs
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Download, Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/Dialog';
import { StudentsList } from '../components/features/students/StudentsList';
import { StudentForm } from '../components/features/students/StudentForm';
import { StudentDetails } from '../components/features/students/StudentDetails';
import { StudentBulkOperations } from '../components/features/students/StudentBulkOperations';
import { useStudentsList, useStudentBulkOperations } from '../hooks/useStudents';
import type { Student, StudentFormData, StudentSearchFilters } from '../types/student.types';
import { STUDENT_UI_TEXT, type StudentStatusType, type SkillLevelType, type GradeType } from '../constants/student.constants';

// ============================================================================
// PAGE INTERFACES
// ============================================================================

interface ModalState {
  addStudent: boolean;
  editStudent: boolean;
  viewStudent: boolean;
  deleteStudent: boolean;
  importStudents: boolean;
  exportStudents: boolean;
}

interface PageState {
  selectedStudent: Student | null;
  filters: StudentSearchFilters;
  searchTerm: string;
  statusFilter: StudentStatusType | '';
  skillLevelFilter: SkillLevelType | '';
  gradeFilter: GradeType | '';
}

// ============================================================================
// STUDENTS PAGE COMPONENT
// ============================================================================

export default function StudentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Modal states
  const [modals, setModals] = useState<ModalState>({
    addStudent: false,
    editStudent: false,
    viewStudent: false,
    deleteStudent: false,
    importStudents: false,
    exportStudents: false
  });

  // Page state
  const [pageState, setPageState] = useState<PageState>({
    selectedStudent: null,
    filters: {},
    searchTerm: '',
    statusFilter: '',
    skillLevelFilter: '',
    gradeFilter: ''
  });

  // Hooks
  const {
    total,
    createStudent,
    updateStudent,
    deleteStudent,
    setFilters,
    setSearch
  } = useStudentsList({
    page: 1,
    limit: 25
  });

  const {
    importLoading,
    exportLoading,
    clearImportResult
  } = useStudentBulkOperations();

  // Initialize filters from URL parameters
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const skillLevel = searchParams.get('skillLevel') || '';
    const grade = searchParams.get('grade') || '';

    setPageState(prev => ({
      ...prev,
      searchTerm: search,
      statusFilter: status as StudentStatusType | '',
      skillLevelFilter: skillLevel as SkillLevelType | '',
      gradeFilter: grade as GradeType | '',
      filters: {
        name: search || undefined,
        status: (status as StudentStatusType) || undefined,
        skillLevel: (skillLevel as SkillLevelType) || undefined,
        grade: (grade as GradeType) || undefined
      }
    }));

    // Apply filters to hook
    setFilters({
      name: search || undefined,
      status: (status as StudentStatusType) || undefined,
      skillLevel: (skillLevel as SkillLevelType) || undefined,
      grade: (grade as GradeType) || undefined
    });

    if (search) {
      setSearch(search);
    }
  }, [searchParams, setFilters, setSearch]);


  // Modal handlers
  const openModal = (modal: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modal]: false }));
    if (modal === 'editStudent' || modal === 'viewStudent') {
      setPageState(prev => ({ ...prev, selectedStudent: null }));
    }
  };

  // Student action handlers
  const handleStudentSelect = (student: Student) => {
    setPageState(prev => ({ ...prev, selectedStudent: student }));
    openModal('viewStudent');
  };

  // Form submission handlers
  const handleCreateStudent = async (data: StudentFormData) => {
    try {
      const result = await createStudent(data);
      if (result.success) {
        closeModal('addStudent');
      }
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleUpdateStudent = async (data: StudentFormData) => {
    if (!pageState.selectedStudent) return;

    try {
      const result = await updateStudent(pageState.selectedStudent.id, data);
      if (result.success) {
        closeModal('editStudent');
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pageState.selectedStudent) return;

    try {
      const result = await deleteStudent(pageState.selectedStudent.id);
      if (result.success) {
        closeModal('deleteStudent');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Bulk operation handlers
  const handleImportComplete = (results: any) => {
    console.log('Import completed:', results);
    closeModal('importStudents');
    clearImportResult();
  };

  const handleExportComplete = (file: Blob) => {
    // Create download link
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeModal('exportStudents');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {STUDENT_UI_TEXT.STUDENT_MANAGEMENT}
              </h1>
              <p className="text-sm text-gray-500">
                {total} {total === 1 ? 'student' : 'students'} total
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => openModal('importStudents')}
                disabled={importLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {STUDENT_UI_TEXT.IMPORT_DATA}
              </Button>
              <Button
                variant="outline"
                onClick={() => openModal('exportStudents')}
                disabled={exportLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                {STUDENT_UI_TEXT.EXPORT_DATA}
              </Button>
              <Button onClick={() => openModal('addStudent')}>
                <Plus className="h-4 w-4 mr-2" />
                {STUDENT_UI_TEXT.ADD_NEW_STUDENT}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StudentsList
          initialFilters={pageState.filters}
          onStudentSelect={handleStudentSelect}
          showActions={true}
          maxHeight="70vh"
        />
      </div>

      {/* Add Student Modal */}
      <Dialog open={modals.addStudent} onOpenChange={() => closeModal('addStudent')}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{STUDENT_UI_TEXT.ADD_STUDENT}</DialogTitle>
            <DialogDescription>
              Add a new student to the system. All required fields must be completed.
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            onSubmit={handleCreateStudent}
            onCancel={() => closeModal('addStudent')}
            loading={false}
            mode="create"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={modals.editStudent} onOpenChange={() => closeModal('editStudent')}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{STUDENT_UI_TEXT.EDIT_STUDENT}</DialogTitle>
            <DialogDescription>
              Update student information. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          {pageState.selectedStudent && (
            <StudentForm
              initialData={pageState.selectedStudent}
              onSubmit={handleUpdateStudent}
              onCancel={() => closeModal('editStudent')}
              loading={false}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Student Modal */}
      <Dialog open={modals.viewStudent} onOpenChange={() => closeModal('viewStudent')}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{STUDENT_UI_TEXT.STUDENT_DETAILS}</DialogTitle>
            <DialogDescription>
              Complete student information and progress tracking.
            </DialogDescription>
          </DialogHeader>
          {pageState.selectedStudent && (
            <StudentDetails
              studentId={pageState.selectedStudent.id}
              editable={true}
              onEdit={() => {
                closeModal('viewStudent');
                openModal('editStudent');
              }}
              onDelete={() => {
                closeModal('viewStudent');
                openModal('deleteStudent');
              }}
              showEnrollments={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={modals.deleteStudent} onOpenChange={() => closeModal('deleteStudent')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {pageState.selectedStudent?.name}? 
              This action cannot be undone and will permanently remove all student data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => closeModal('deleteStudent')}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Student
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Students Modal */}
      <Dialog open={modals.importStudents} onOpenChange={() => closeModal('importStudents')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Students</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import multiple students at once.
            </DialogDescription>
          </DialogHeader>
          <StudentBulkOperations
            onImportComplete={handleImportComplete}
            onExportComplete={handleExportComplete}
            currentFilters={pageState.filters}
          />
        </DialogContent>
      </Dialog>

      {/* Export Students Modal */}
      <Dialog open={modals.exportStudents} onOpenChange={() => closeModal('exportStudents')}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Students</DialogTitle>
            <DialogDescription>
              Export student data to CSV format with your selected filters.
            </DialogDescription>
          </DialogHeader>
          <StudentBulkOperations
            onImportComplete={handleImportComplete}
            onExportComplete={handleExportComplete}
            currentFilters={pageState.filters}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
