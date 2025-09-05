/**
 * Student Details Component
 * Comprehensive view of student information with edit capabilities
 */

import React, { useState } from 'react';
import { Edit, Trash2, Mail, Phone, Calendar, School, User, Shield, AlertTriangle, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Card } from '../../ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/Dialog';
import { useStudentDetails } from '../../../hooks/useStudents';
import type { Student } from '../../../types/student.types';
import {
  STUDENT_STATUS,
  STUDENT_SKILL_LEVELS,
  STUDENT_UI_TEXT
} from '../../../constants/student.constants';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

export interface StudentDetailsProps {
  studentId: string;
  editable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  showEnrollments?: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case STUDENT_STATUS.ACTIVE:
      return 'success';
    case STUDENT_STATUS.INACTIVE:
      return 'secondary';
    case STUDENT_STATUS.GRADUATED:
      return 'default';
    case STUDENT_STATUS.SUSPENDED:
      return 'destructive';
    default:
      return 'outline';
  }
};

const getSkillLevelBadgeVariant = (skillLevel: string) => {
  switch (skillLevel) {
    case STUDENT_SKILL_LEVELS.BEGINNER:
      return 'secondary';
    case STUDENT_SKILL_LEVELS.INTERMEDIATE:
      return 'warning';
    case STUDENT_SKILL_LEVELS.ADVANCED:
      return 'success';
    case STUDENT_SKILL_LEVELS.EXPERT:
      return 'default';
    default:
      return 'outline';
  }
};

// ============================================================================
// STUDENT DETAILS COMPONENT
// ============================================================================

export function StudentDetails({
  studentId,
  editable = true,
  onEdit,
  onDelete,
  showEnrollments = true
}: StudentDetailsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const {
    student,
    loading,
    error,
    refetch,
    updateStudent,
    deleteStudent: deleteStudentHook
  } = useStudentDetails(studentId);

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      const result = await deleteStudentHook();
      if (result.success) {
        onDelete?.();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
    setShowDeleteDialog(false);
  };

  // Handle edit
  const handleEdit = () => {
    onEdit?.();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Student</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!student) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Student Not Found</h3>
          <p className="text-muted-foreground">The requested student could not be found.</p>
        </div>
      </Card>
    );
  }

  const age = calculateAge(student.dateOfBirth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={getStatusBadgeVariant(student.status)}>
              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
            </Badge>
            <Badge variant={getSkillLevelBadgeVariant(student.skillLevel)}>
              {student.skillLevel.charAt(0).toUpperCase() + student.skillLevel.slice(1)}
            </Badge>
          </div>
        </div>
        {editable && (
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Student
            </Button>
            <Button onClick={() => setShowDeleteDialog(true)} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{STUDENT_UI_TEXT.PERSONAL_INFORMATION}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <p className="text-sm font-medium">{student.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Age</label>
            <p className="text-sm font-medium">{age} years old</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
            <p className="text-sm font-medium">{formatDate(student.dateOfBirth)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">School</label>
            <p className="text-sm font-medium">{student.school}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Grade</label>
            <p className="text-sm font-medium">Grade {student.grade}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Student Since</label>
            <p className="text-sm font-medium">{formatDate(student.createdAt)}</p>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{STUDENT_UI_TEXT.CONTACT_INFORMATION}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Parent/Guardian</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{student.parentEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{student.parentPhone}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">Emergency Contact</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">{student.emergencyContactName}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({student.emergencyContactRelation})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{student.emergencyContactPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Program Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{STUDENT_UI_TEXT.PROGRAM_INFORMATION}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Skill Level</label>
            <div className="mt-1">
              <Badge variant={getSkillLevelBadgeVariant(student.skillLevel)}>
                {student.skillLevel.charAt(0).toUpperCase() + student.skillLevel.slice(1)}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <Badge variant={getStatusBadgeVariant(student.status)}>
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Enrolled Courses</label>
            <p className="text-sm font-medium">{student.enrolledCourses.length} courses</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Completed Workshops</label>
            <p className="text-sm font-medium">{student.completedWorkshops.length} workshops</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="text-sm font-medium">{formatDate(student.updatedAt)}</p>
          </div>
        </div>
      </Card>

      {/* Enrollment History */}
      {showEnrollments && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Enrollment History</h2>
          </div>
          {student.enrolledCourses.length > 0 ? (
            <div className="space-y-2">
              {student.enrolledCourses.map((courseId, index) => (
                <div key={courseId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">Course {index + 1}</span>
                    <p className="text-sm text-muted-foreground">ID: {courseId}</p>
                  </div>
                  <Badge variant="outline">Enrolled</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No enrollment history available
            </p>
          )}
        </Card>
      )}

      {/* Progress Tracking */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Progress Tracking</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-primary">{student.enrolledCourses.length}</div>
            <div className="text-sm text-muted-foreground">Active Courses</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{student.completedWorkshops.length}</div>
            <div className="text-sm text-muted-foreground">Completed Workshops</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {student.enrolledCourses.length + student.completedWorkshops.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Activities</div>
          </div>
        </div>
      </Card>

      {/* Notes and Special Requirements */}
      {(student.specialRequirements || student.progressComments || student.medicalNotes) && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5" />
            <h2 className="text-xl font-semibold">{STUDENT_UI_TEXT.NOTES_AND_REQUIREMENTS}</h2>
          </div>
          <div className="space-y-4">
            {student.specialRequirements && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Special Requirements</label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{student.specialRequirements}</p>
              </div>
            )}
            {student.progressComments && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Progress Comments</label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{student.progressComments}</p>
              </div>
            )}
            {student.medicalNotes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Medical Notes</label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{student.medicalNotes}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {student.name}? This action cannot be undone.
              All associated data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Student
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
