/**
 * Add New Student Page
 * Dedicated page for creating new students
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StudentForm } from '../../components/features/students/StudentForm';
import { useStudentsList } from '../../hooks/useStudents';
import { ROUTE_PATHS } from '../../constants/routes';
import { STUDENT_UI_TEXT } from '../../constants/student.constants';

export default function StudentNewPage() {
  const navigate = useNavigate();
  const { createStudent } = useStudentsList();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await createStudent(data);
      if (result.success) {
        navigate(ROUTE_PATHS.STUDENTS);
      }
    } catch (error) {
      console.error('Error creating student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTE_PATHS.STUDENTS);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(ROUTE_PATHS.STUDENTS)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{STUDENT_UI_TEXT.ADD_STUDENT}</h1>
          <p className="text-muted-foreground">
            Add a new student to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <StudentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          mode="create"
        />
      </div>
    </div>
  );
}
