# Student Management Components

Comprehensive suite of components for student management including list view, forms, and CRUD operations.

## Components

### 1. StudentsList Component
A feature-rich table component for student management with advanced search, filtering, and CRUD operations.

### 2. StudentForm Component  
A comprehensive form component for creating and editing students with React Hook Form and Zod validation.

## Features

### Core Functionality
- ✅ **Real-time Search**: Debounced search across student name, school, and parent email
- ✅ **Advanced Filtering**: Filter by status, skill level, grade level, and school
- ✅ **Sortable Columns**: Click column headers to sort data
- ✅ **Pagination**: Configurable page sizes with navigation controls
- ✅ **Bulk Operations**: Select multiple students for bulk actions
- ✅ **CRUD Operations**: Create, read, update, delete with optimistic updates

### UI/UX Features
- ✅ **Mobile Responsive**: Adaptive design with collapsible filters
- ✅ **Touch Friendly**: Optimized for mobile interactions
- ✅ **Loading States**: Skeleton loading and progress indicators
- ✅ **Error Handling**: Graceful error states with retry options
- ✅ **Empty States**: Informative empty states with action prompts

### Security & Permissions
- ✅ **Role-based Access**: UI adapts based on user permissions
- ✅ **Permission Gates**: Actions hidden/disabled based on role
- ✅ **Secure Operations**: All operations respect user permissions

## Props Interface

```typescript
interface StudentsListProps {
  initialFilters?: StudentSearchFilters
  onStudentSelect?: (student: Student) => void
  showBulkActions?: boolean
  maxHeight?: string
  role: UserRole
}
```

### Props Details

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialFilters` | `StudentSearchFilters` | `{}` | Initial search and filter parameters |
| `onStudentSelect` | `(student: Student) => void` | `undefined` | Callback when a student row is clicked |
| `showBulkActions` | `boolean` | `true` | Show/hide bulk selection checkboxes |
| `maxHeight` | `string` | `undefined` | Maximum height for table container |
| `role` | `UserRole` | **Required** | User role for permission-based UI |

## Usage Examples

### Basic Usage

```tsx
import StudentsList from './components/features/students/StudentsList'
import { useAuth } from './hooks/useAuth'

function StudentsPage() {
  const { user } = useAuth()

  return (
    <StudentsList 
      role={user?.role || 'teacher'}
    />
  )
}
```

### With Initial Filters

```tsx
const initialFilters = {
  status: 'active',
  skill_level: 'beginner',
  page: 1,
  limit: 20
}

<StudentsList 
  initialFilters={initialFilters}
  role={userRole}
/>
```

### With Student Selection Handler

```tsx
const handleStudentSelect = (student: Student) => {
  console.log('Selected:', student)
  // Navigate to student detail page
  navigate(`/students/${student.id}`)
}

<StudentsList 
  onStudentSelect={handleStudentSelect}
  role={userRole}
/>
```

### Embedded in Dashboard

```tsx
<StudentsList 
  maxHeight="400px"
  showBulkActions={false}
  role={userRole}
  initialFilters={{ limit: 10 }}
/>
```

## Table Columns

| Column | Sortable | Mobile Hidden | Description |
|--------|----------|---------------|-------------|
| Name | ✅ | ❌ | Student full name |
| School | ✅ | ✅ | School name |
| Grade | ❌ | ❌ | Grade level (K-12) |
| Skill Level | ✅ | ✅ | Programming skill level |
| Status | ✅ | ❌ | Student status badge |
| Enrolled | ✅ | ✅ | Enrollment date |
| Actions | ❌ | ❌ | Edit/Delete buttons |

## Filter Options

### Status Filter
- All Statuses
- Active
- Inactive  
- Suspended
- Graduated

### Skill Level Filter
- All Skill Levels
- Beginner
- Intermediate
- Advanced

### Grade Level Filter
- All Grades
- K, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12

## Permission Matrix

| Role | Create | Edit | Delete | Bulk Delete | Export |
|------|--------|------|--------|-------------|--------|
| Super Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ❌ | ✅ |
| Teacher | ❌ | ❌ | ❌ | ❌ | ✅ |

## Mobile Responsiveness

### Breakpoints
- **Mobile**: < 768px - Stacked filters, horizontal scroll table
- **Tablet**: 768px - 1024px - Collapsible filters
- **Desktop**: > 1024px - Full layout with side-by-side filters

### Mobile Optimizations
- Collapsible filter panel
- Touch-friendly button sizes (min 44px)
- Horizontal scrolling table
- Hidden non-essential columns
- Simplified pagination controls

## Search Functionality

### Search Scope
The search function looks across:
- Student full name
- School name  
- Parent email address

### Search Behavior
- **Debounced**: 300ms delay to prevent excessive API calls
- **Minimum Length**: 2 characters required
- **Case Insensitive**: Automatic case normalization
- **Real-time**: Results update as you type

## State Management

### Hooks Used
- `useStudentsList` - Main data fetching and mutations
- `useStudentSearch` - Debounced search functionality  
- `useStudentSelection` - Bulk selection state
- `useAuth` - User authentication and role

### Performance Optimizations
- React Query caching (5min stale time)
- Debounced search queries
- Optimistic updates for mutations
- Memoized callbacks and state updates

## Error Handling

### Error States
- **Network Errors**: Retry button with error message
- **Validation Errors**: Inline field validation
- **Permission Errors**: Access denied messages
- **Not Found**: Empty state with create action

### Error Recovery
- Automatic retry for transient failures
- Manual retry buttons for user-triggered recovery
- Fallback to cached data when available
- Graceful degradation for missing features

## Accessibility

### ARIA Support
- Proper table headers and relationships
- Accessible form labels and descriptions
- Screen reader friendly status badges
- Keyboard navigation support

### Keyboard Navigation
- Tab through interactive elements
- Enter/Space for button activation
- Arrow keys for table navigation
- Escape to close modals

## Testing

### Unit Tests
```bash
npm test StudentsList.test.tsx
```

### Integration Tests  
```bash
npm test StudentsList.integration.test.tsx
```

### E2E Tests
```bash
npm run e2e:students
```

## Performance Metrics

### Bundle Size
- Component: ~15KB gzipped
- Dependencies: shadcn/ui components
- Total Impact: ~25KB added to bundle

### Runtime Performance
- Initial Render: < 50ms
- Search Response: < 300ms (debounced)
- Sort/Filter: < 100ms
- Page Navigation: < 50ms

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### Required
- React 18+
- TypeScript 4.5+
- @tanstack/react-query
- tailwindcss

### UI Components
- shadcn/ui components (Button, Input, Table, etc.)
- Custom UI components in `/components/ui/`

## Migration Guide

### From v1.0 to v2.0
If upgrading from an older version:

1. Update props interface - `role` prop is now required
2. Update permission constants import path
3. Update CSS classes to use Tailwind design system
4. Test mobile responsiveness on target devices

## Troubleshooting

### Common Issues

**Search not working**
- Check debounce delay in `useStudentSearch`
- Verify API endpoint connectivity
- Check minimum search length requirement

**Permissions not updating**
- Verify `role` prop is current user role
- Check permission constants are imported correctly
- Refresh user session if needed

**Mobile layout broken**
- Check Tailwind CSS is properly configured
- Verify responsive classes are applied
- Test on actual devices, not just browser resize

---

# StudentForm Component

A comprehensive form component for creating and editing students with full validation and database schema compliance.

## StudentForm Features

### Form Functionality
- ✅ **React Hook Form**: Full integration with form state management
- ✅ **Zod Validation**: Schema-based validation matching database constraints
- ✅ **Real-time Validation**: Field-level error messages and feedback
- ✅ **Auto-save Draft**: Automatic draft saving for create mode
- ✅ **Dirty State Tracking**: Tracks form modifications
- ✅ **Reset Functionality**: Reset form to initial state

### Database Schema Compliance
- ✅ **Exact Field Matching**: All fields match database column names
- ✅ **Constraint Validation**: Length, format, and type validation
- ✅ **Required Fields**: Proper required field validation
- ✅ **Optional Fields**: Handles nullable database fields correctly

### User Experience
- ✅ **Progressive Sections**: Organized into logical form sections
- ✅ **Mobile Responsive**: Adaptive layout for all screen sizes  
- ✅ **Accessibility**: ARIA labels and keyboard navigation
- ✅ **Loading States**: Visual feedback during submission
- ✅ **Error Recovery**: Comprehensive error handling

## StudentForm Props

```typescript
interface StudentFormProps {
  initialData?: Student          // For edit mode - existing student data
  onSubmit: (data: StudentFormData) => Promise<void>  // Form submission handler
  onCancel: () => void          // Cancel button handler
  loading?: boolean             // External loading state
  mode: 'create' | 'edit'       // Form mode determines behavior
}
```

## StudentForm Usage Examples

### Create New Student

```tsx
import StudentForm from './components/features/students/StudentForm'

function CreateStudentPage() {
  const navigate = useNavigate()

  const handleSubmit = async (data: StudentFormData) => {
    try {
      await studentService.create(data)
      navigate('/students')
    } catch (error) {
      console.error('Create failed:', error)
      throw error // Form will handle display
    }
  }

  return (
    <StudentForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={() => navigate('/students')}
    />
  )
}
```

### Edit Existing Student

```tsx
function EditStudentPage({ studentId }: { studentId: string }) {
  const { student, loading } = useStudentDetails(studentId)
  const navigate = useNavigate()

  const handleSubmit = async (data: StudentFormData) => {
    await studentService.update(studentId, data)
    navigate('/students')
  }

  if (loading) return <LoadingSpinner />

  return (
    <StudentForm
      mode="edit"
      initialData={student}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/students')}
    />
  )
}
```

### Modal Form Integration

```tsx
function StudentModal({ student, onClose }: { student?: Student, onClose: () => void }) {
  const { createStudent, updateStudent } = useStudentsList()

  const handleSubmit = async (data: StudentFormData) => {
    if (student) {
      await updateStudent(student.id, data)
    } else {
      await createStudent(data)
    }
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <StudentForm
          mode={student ? 'edit' : 'create'}
          initialData={student}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
```

## Form Sections

### 1. Personal Information
- **Full Name** (required, 2-255 chars)
- **Date of Birth** (required, age 5-18)
- **School Name** (required, 2-255 chars)  
- **Grade Level** (required, K-12 format)

### 2. Contact Information
- **Parent Email** (required, valid email, max 255 chars)
- **Parent Phone** (required, valid phone, max 20 chars)
- **Emergency Contact Name** (optional, max 255 chars)
- **Emergency Contact Phone** (optional, valid phone if provided)

### 3. Program Information
- **Skill Level** (required, enum: beginner/intermediate/advanced)
- **Special Requirements** (optional, max 1000 chars)
- **Medical Notes** (optional, max 1000 chars)

## Validation Rules

### Required Field Validation
```typescript
// All required fields must be provided
const requiredFields = [
  'full_name',
  'date_of_birth', 
  'school_name',
  'grade_level',
  'parent_email',
  'parent_phone',
  'skill_level'
]
```

### Length Constraints
```typescript
const lengthRules = {
  full_name: { min: 2, max: 255 },
  school_name: { min: 2, max: 255 },
  parent_email: { max: 255 },
  parent_phone: { max: 20 },
  emergency_contact_name: { max: 255 },
  emergency_contact_phone: { max: 20 },
  special_requirements: { max: 1000 },
  medical_notes: { max: 1000 }
}
```

### Format Validation
```typescript
const formatRules = {
  parent_email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  parent_phone: /^\+?[1-9]\d{1,14}$/,
  grade_level: /^(K|[1-9]|1[0-2])$/,
  age: { min: 5, max: 18 } // calculated from date_of_birth
}
```

## Auto-save Functionality

The form includes auto-save functionality for create mode:

### Auto-save Features
- **Draft Storage**: Saves form data to localStorage
- **2-Second Debounce**: Prevents excessive saves
- **Valid Data Only**: Only saves when form passes validation
- **Visual Feedback**: Shows save status to user
- **Draft Recovery**: Loads saved draft on page reload

### Auto-save Controls
```tsx
// Auto-save can be toggled by user
<Button onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}>
  Auto-save: {autoSaveEnabled ? 'On' : 'Off'}
</Button>
```

## Error Handling

### Validation Errors
- **Field-level**: Individual field validation with inline errors
- **Form-level**: Overall form validation status
- **Real-time**: Validation occurs on field change
- **Submit-time**: Final validation before submission

### Submission Errors
- **Network Errors**: Connection and server error handling
- **Validation Errors**: Server-side validation feedback
- **User Feedback**: Clear error messages with retry options

### Error Recovery
```tsx
const onFormSubmit = async (data: StudentFormSchema) => {
  try {
    await onSubmit(formDataToStudentData(data))
  } catch (error: any) {
    setSubmitError(error?.message || 'Submission failed')
    // Form remains in editable state for retry
  }
}
```

## Accessibility Features

### ARIA Support
- **Labels**: Proper form labels with required indicators
- **Descriptions**: Field descriptions for complex inputs
- **Error Messages**: Associated error messages with aria-describedby
- **Form Sections**: Logical grouping with proper headings

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through form fields
- **Submit Handling**: Enter key submits form appropriately
- **Cancel Handling**: Escape key cancels when appropriate
- **Focus Management**: Proper focus handling for validation errors

## Integration with StudentsList

The StudentForm integrates seamlessly with StudentsList:

```tsx
function StudentsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  
  return (
    <div>
      <StudentsList 
        onStudentSelect={(student) => setEditStudent(student)}
        role={userRole}
      />
      
      {(showForm || editStudent) && (
        <StudentForm
          mode={editStudent ? 'edit' : 'create'}
          initialData={editStudent}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditStudent(null)
          }}
        />
      )}
    </div>
  )
}
```

## Support

For issues or questions:
1. Check this README first
2. Review the example implementation
3. Check the component's TypeScript definitions
4. File an issue with reproduction steps
