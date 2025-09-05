/**
 * Student Details Page
 * Dedicated page for viewing student details
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StudentDetails } from '../../components/features/students/StudentDetails';
import { ROUTE_PATHS } from '../../constants/routes';
import { STUDENT_UI_TEXT } from '../../constants/student.constants';

export default function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Student Not Found</h2>
        <p className="text-gray-500 mt-2">The requested student could not be found.</p>
        <Button
          onClick={() => navigate(ROUTE_PATHS.STUDENTS)}
          className="mt-4"
        >
          Back to Students
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(ROUTE_PATHS.STUDENTS_EDIT.replace(':id', id));
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete student:', id);
    setShowDeleteDialog(false);
    navigate(ROUTE_PATHS.STUDENTS);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(ROUTE_PATHS.STUDENTS)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{STUDENT_UI_TEXT.STUDENT_DETAILS}</h1>
            <p className="text-muted-foreground">
              View and manage student information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Student
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Student Details */}
      <StudentDetails
        studentId={id}
        editable={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showEnrollments={true}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteDialog(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Student</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
