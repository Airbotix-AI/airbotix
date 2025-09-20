/**
 * Student Details Component
 * 
 * A comprehensive component for viewing complete student information and enrollment history.
 * Features clean, organized layout with shadcn/ui cards, enrollment history, edit mode toggle,
 * and role-based action visibility.
 * 
 * @file StudentDetails.tsx
 * @version 1.0.0
 */

import { useStudentDetailsWithEnrollments, type StudentDetailsData } from '../../../hooks/useStudents'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { LoadingSpinner } from '../../ui/LoadingSpinner'
import { format, formatDistanceToNow } from 'date-fns'
import {
  USER_ROLES,
  STUDENT_STATUS_LABELS,
  STUDENT_STATUS_COLORS,
  STUDENT_SKILL_LEVEL_LABELS,
  WORKSHOP_STATUS_LABELS,
  WORKSHOP_STATUS_COLORS
} from '../../../constants/student.constants'
import type { UserRole } from '../../../types/student.types'
import { cn } from '../../../utils'

// ============================================================================
// COMPONENT PROPS INTERFACE
// ============================================================================

export interface StudentDetailsProps {
  studentId: string
  editable?: boolean
  onEdit?: () => void
  onDelete?: () => void
  showEnrollments?: boolean
  userRole: UserRole
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates skill level progress for visual indicator
 */
function getSkillLevelProgress(skillLevel: string): number {
  switch (skillLevel) {
    case 'beginner': return 33
    case 'intermediate': return 66
    case 'advanced': return 100
    default: return 0
  }
}

/**
 * Gets color for skill level progress bar
 */
function getSkillLevelColor(skillLevel: string): string {
  switch (skillLevel) {
    case 'beginner': return 'bg-blue-500'
    case 'intermediate': return 'bg-yellow-500'
    case 'advanced': return 'bg-green-500'
    default: return 'bg-gray-300'
  }
}

/**
 * Formats timestamp for activity timeline
 */
function formatActivityTime(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'Unknown time'
  }
}

/**
 * Gets activity icon based on type
 */
function getActivityIcon(type: string): string {
  switch (type) {
    case 'enrollment': return 'E'
    case 'attendance': return 'A'
    case 'profile_update': return 'U'
    default: return 'N'
  }
}

/**
 * Checks if user can perform action based on role
 */
function canPerformAction(userRole: UserRole, action: 'edit' | 'delete'): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    [USER_ROLES.SUPER_ADMIN]: 3,
    [USER_ROLES.ADMIN]: 2,
    [USER_ROLES.TEACHER]: 1,
    [USER_ROLES.STUDENT]: 0
  }

  const userLevel = roleHierarchy[userRole] || 0

  switch (action) {
    case 'edit':
    case 'delete':
      return userLevel >= 2 // Admin and Super Admin can edit/delete
    default:
      return false
  }
}

// ============================================================================
// COMPONENT SECTIONS
// ============================================================================

/**
 * Header section with student name, status, and action buttons
 */
function StudentHeader({ 
  studentDetails, 
  userRole, 
  editable, 
  onEdit, 
  onDelete,
  isUpdating,
  isDeleting 
}: {
  studentDetails: StudentDetailsData
  userRole: UserRole
  editable?: boolean
  onEdit?: () => void
  onDelete?: () => void
  isUpdating: boolean
  isDeleting: boolean
}) {
  const canEdit = canPerformAction(userRole, 'edit')
  const canDelete = canPerformAction(userRole, 'delete')

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <CardTitle className="text-2xl sm:text-3xl">{studentDetails.full_name}</CardTitle>
              <Badge variant={STUDENT_STATUS_COLORS[studentDetails.status]}>
                {STUDENT_STATUS_LABELS[studentDetails.status]}
              </Badge>
            </div>
            <CardDescription>
              Student ID: {studentDetails.id.slice(0, 8)}... | Age: {studentDetails.age} years old
            </CardDescription>
            <div className="text-sm text-muted-foreground">
              <p>Created: {format(new Date(studentDetails.created_at), 'PPP')}</p>
              {studentDetails.updated_at !== studentDetails.created_at && (
                <p>Last updated: {format(new Date(studentDetails.updated_at), 'PPP')}</p>
              )}
            </div>
          </div>
          
          {editable && (canEdit || canDelete) && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {canEdit && onEdit && (
                <Button 
                  variant="outline" 
                  onClick={onEdit}
                  disabled={isUpdating || isDeleting}
                  className="w-full sm:w-auto"
                >
                  {isUpdating ? 'Updating...' : 'Edit'}
                </Button>
              )}
              {canDelete && onDelete && (
                <Button 
                  variant="destructive" 
                  onClick={onDelete}
                  disabled={isUpdating || isDeleting}
                  className="w-full sm:w-auto"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  )
}

/**
 * Personal information card
 */
function PersonalInformationCard({ studentDetails }: { studentDetails: StudentDetailsData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <p className="text-sm">{studentDetails.full_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
            <p className="text-sm">
              {format(new Date(studentDetails.date_of_birth), 'PPP')} ({studentDetails.age} years old)
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">School</label>
            <p className="text-sm">{studentDetails.school_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Grade Level</label>
            <p className="text-sm">{studentDetails.grade_level}</p>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">Skill Level</label>
          <div className="mt-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {STUDENT_SKILL_LEVEL_LABELS[studentDetails.skill_level]}
              </span>
              <div className="flex-1 max-w-xs">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", getSkillLevelColor(studentDetails.skill_level))}
                    style={{ width: `${getSkillLevelProgress(studentDetails.skill_level)}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {getSkillLevelProgress(studentDetails.skill_level)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Contact information card
 */
function ContactInformationCard({ studentDetails }: { studentDetails: StudentDetailsData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Parent Name</label>
            <p className="text-sm">{studentDetails.parent_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Parent Email</label>
            <a 
              href={`mailto:${studentDetails.parent_email}`}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline block"
            >
              {studentDetails.parent_email}
            </a>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Parent Phone</label>
            <a 
              href={`tel:${studentDetails.parent_phone}`}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline block"
            >
              {studentDetails.parent_phone}
            </a>
          </div>
          
          {(studentDetails.emergency_contact_name || studentDetails.emergency_contact_phone) && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Emergency Contact</h4>
              <div className="grid grid-cols-1 gap-2">
                {studentDetails.emergency_contact_name && (
                  <div>
                    <label className="text-xs text-muted-foreground">Name</label>
                    <p className="text-sm">{studentDetails.emergency_contact_name}</p>
                  </div>
                )}
                {studentDetails.emergency_contact_phone && (
                  <div>
                    <label className="text-xs text-muted-foreground">Phone</label>
                    <a 
                      href={`tel:${studentDetails.emergency_contact_phone}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline block"
                    >
                      {studentDetails.emergency_contact_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

 

/**
 * Enrollment history card
 */
function EnrollmentHistoryCard({ studentDetails }: { studentDetails: StudentDetailsData }) {
  if (studentDetails.enrollments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrollment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No enrollments found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Enrollment History</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Total: {studentDetails.totalEnrollments}</span>
            <span>Attended: {studentDetails.attendedCount}</span>
            <span>Rate: {studentDetails.attendancePercentage}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Attendance Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Attendance Overview</h4>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${studentDetails.attendancePercentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium">{studentDetails.attendancePercentage}%</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {studentDetails.attendedCount} of {studentDetails.totalEnrollments} workshops attended
          </div>
        </div>

        {/* Enrollment List */}
        <div className="space-y-4">
          {studentDetails.enrollments.map((enrollment) => (
            <div key={enrollment.id} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{enrollment.workshop?.title || 'Untitled Workshop'}</h4>
                    <Badge variant={WORKSHOP_STATUS_COLORS[enrollment.workshop?.status || 'draft']}>
                      {WORKSHOP_STATUS_LABELS[enrollment.workshop?.status] || enrollment.workshop?.status}
                    </Badge>
                  </div>
                  
                  {enrollment.workshop?.instructor && (
                    <p className="text-sm text-muted-foreground">
                      Instructor: {enrollment.workshop.instructor.full_name}
                    </p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <span>Enrolled: {format(new Date(enrollment.enrolled_at), 'PPP')}</span>
                    {enrollment.workshop?.scheduled_date && (
                      <span>Scheduled: {format(new Date(enrollment.workshop.scheduled_date), 'PPP')}</span>
                    )}
                  </div>
                  
                  {enrollment.notes && (
                    <p className="text-sm text-muted-foreground italic">Note: {enrollment.notes}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <Badge 
                    variant={enrollment.attended ? 'success' : 'secondary'}
                    className="mb-2"
                  >
                    {enrollment.attended ? 'Attended' : 'Not Attended'}
                  </Badge>
                  {enrollment.attendance_marked_at && (
                    <p className="text-xs text-muted-foreground">
                      Marked: {format(new Date(enrollment.attendance_marked_at), 'PPP')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Activity timeline card
 */
function ActivityTimelineCard({ studentDetails }: { studentDetails: StudentDetailsData }) {
  if (studentDetails.recentActivity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studentDetails.recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{formatActivityTime(activity.timestamp)}</p>
                {activity.workshop && (
                  <p className="text-xs text-blue-600">{activity.workshop.title}</p>
                )}
              </div>
              {index < studentDetails.recentActivity.length - 1 && (
                <div className="absolute left-4 mt-8 w-px h-4 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * StudentDetails component for viewing complete student information
 */
export function StudentDetails({
  studentId,
  editable = true,
  onEdit,
  onDelete,
  showEnrollments = true,
  userRole
}: StudentDetailsProps) {
  const { 
    studentDetails, 
    loading, 
    error, 
    deleteStudent,
    isUpdating,
    isDeleting 
  } = useStudentDetailsWithEnrollments(studentId)

  // Handle edit action
  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    }
  }

  // Handle delete action
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        await deleteStudent()
        if (onDelete) {
          onDelete()
        }
      } catch (error) {
        console.error('Failed to delete student:', error)
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-muted-foreground">Loading student details...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load student details</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No data state
  if (!studentDetails) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Student not found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <StudentHeader
        studentDetails={studentDetails}
        userRole={userRole}
        editable={editable}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />

      {/* Information Cards Grid - desktop-optimized */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <PersonalInformationCard studentDetails={studentDetails} />
        </div>
        <div className="xl:col-span-4 space-y-6">
          <ContactInformationCard studentDetails={studentDetails} />
        </div>
      </div>

      {/* Enrollment History */}
      {showEnrollments && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <EnrollmentHistoryCard studentDetails={studentDetails} />
          </div>
          <div className="xl:col-span-4">
            <ActivityTimelineCard studentDetails={studentDetails} />
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDetails
