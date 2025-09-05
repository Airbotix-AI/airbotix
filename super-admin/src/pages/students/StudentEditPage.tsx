/**
 * Edit Student Page
 * Dedicated page for editing existing students
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StudentForm } from '../../components/features/students/StudentForm';
import { useStudentDetails } from '../../hooks/useStudents';
import { ROUTE_PATHS } from '../../constants/routes';
import { STUDENT_UI_TEXT } from '../../constants/student.constants';

export default function StudentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student, updateStudent, loading } = useStudentDetails(id || '');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate(ROUTE_PATHS.STUDENTS);
    }
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    setFormLoading(true);
    try {
      const result = await updateStudent(data);
      if (result.success) {
        navigate(ROUTE_PATHS.STUDENTS_DETAILS.replace(':id', id));
      }
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(ROUTE_PATHS.STUDENTS_DETAILS.replace(':id', id));
    } else {
      navigate(ROUTE_PATHS.STUDENTS);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(ROUTE_PATHS.STUDENTS_DETAILS.replace(':id', id!))}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{STUDENT_UI_TEXT.EDIT_STUDENT}</h1>
          <p className="text-muted-foreground">
            Update student information
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <StudentForm
          initialData={student}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
          mode="edit"
        />
      </div>
    </div>
  );
}
