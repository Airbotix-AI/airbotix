# Supabase Migrations for Airbotix Super Admin

This directory contains Supabase migrations for the Airbotix Super Admin application. The migrations follow PostgreSQL best practices and implement comprehensive Row Level Security (RLS) policies.

## Migration Overview

### 1. `20250910063044_create_students_table.sql`
Creates the comprehensive students management system with:

#### Tables Created:
- **`students`**: Main student information table
- **`students_audit_log`**: Audit trail for all student record changes

#### Features:
- **Data Types**: Custom enums for `student_skill_level` and `student_status`
- **Validation**: Email format, phone number format, age validation (5-18 years)
- **Constraints**: Proper CHECK constraints for data integrity
- **Indexes**: Full-text search on names, performance indexes for common queries
- **Audit Trail**: Comprehensive logging of all changes
- **RLS Policies**: Role-based access control
- **Triggers**: Automatic timestamp and user tracking
- **Views**: Convenient views for common queries

#### Student Table Schema:
```sql
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personal Information
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  school_name VARCHAR(255) NOT NULL,
  grade_level VARCHAR(10) NOT NULL,
  
  -- Contact Information  
  parent_email VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(20) NOT NULL,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  
  -- Program Information
  skill_level student_skill_level NOT NULL DEFAULT 'beginner',
  status student_status NOT NULL DEFAULT 'active',
  special_requirements TEXT,
  medical_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);
```

### 2. `20250910063129_create_user_profiles_and_roles.sql`
Creates the role-based access control system with:

#### Tables Created:
- **`profiles`**: Extended user profiles linked to `auth.users`
- **`profiles_audit_log`**: Audit trail for profile changes
- **`role_permissions`**: Granular permission system

#### Features:
- **Role Hierarchy**: `super_admin` > `admin` > `teacher` > `student`
- **Comprehensive RLS**: Fine-grained access control
- **Audit Trail**: Complete change tracking
- **Permission System**: Granular resource-action permissions
- **Auto Profile Creation**: Triggers for new user registration
- **Activity Tracking**: Login timestamps and activity monitoring
- **Views**: Management and reporting views

#### Profiles Table Schema:
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'teacher',
  phone VARCHAR(20),
  avatar_url TEXT,
  department VARCHAR(100),
  employee_id VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Role-Based Access Control

### Role Hierarchy:
1. **Super Admin**: Full system access, can manage everything
2. **Admin**: Can manage students, teachers, workshops, and content
3. **Teacher**: Read-only access to assigned students and workshops
4. **Student**: Minimal access (future feature)

### Permission Matrix:

| Resource | Super Admin | Admin | Teacher | Student |
|----------|-------------|-------|---------|---------|
| Students | Full CRUD | Full CRUD | Read Only | No Access |
| Teachers | Full CRUD | Manage (no delete) | Read Only | No Access |
| Workshops | Full CRUD | Full CRUD | Read Only | No Access |
| Courses | Full CRUD | Full CRUD | Read Only | No Access |
| Content | Full CRUD | Full CRUD | Read Only | No Access |
| Reports | Read | Read | Limited | No Access |
| Audit Logs | Read | Read | No Access | No Access |
| System Settings | Full | No Access | No Access | No Access |

## Key Functions

### Role Checking Functions:
- `public.get_user_role(user_id)`: Returns user role
- `public.is_super_admin(user_id)`: Check super admin status
- `public.is_admin_or_above(user_id)`: Check admin+ permissions
- `public.is_teacher_or_above(user_id)`: Check teacher+ permissions
- `public.can_manage_user(target_user_id, current_user_id)`: Check user management permissions
- `public.has_permission(resource, action, user_id)`: Check granular permissions

### Automatic Functions:
- `public.handle_new_user()`: Creates profile on user registration
- `public.update_updated_at_column()`: Auto-updates timestamps
- `public.set_created_by()`: Auto-sets creation metadata
- `public.update_last_login()`: Tracks login activity

## Performance Optimizations

### Indexes Created:
- Full-text search indexes for names
- Composite indexes for common query patterns
- Role and status filtering indexes
- Temporal indexes for date-based queries

### Views for Common Queries:
- `active_students`: Active students only
- `students_by_skill_level`: Student distribution by skill
- `students_by_school`: Student distribution by school
- `active_users_by_role`: User distribution by role
- `recent_user_activity`: User activity tracking
- `department_summary`: Department statistics

## Security Features

### Row Level Security (RLS):
- All tables have RLS enabled
- Policies enforce role-based access
- Audit logs protect sensitive operations

### Data Validation:
- Email format validation using regex
- Phone number format validation
- Age constraints (5-18 years for students)
- Input length limits and sanitization

### Audit Trail:
- Complete change tracking for all tables
- IP address and user agent logging (where possible)
- Automatic audit log generation via triggers

## Running Migrations

### Prerequisites:
1. Supabase CLI installed and configured
2. Project initialized with `supabase init`
3. Database connection configured

### Apply Migrations:
```bash
# Start local Supabase (for development)
supabase start

# Apply migrations to local database
supabase db reset

# Apply to remote database (production)
supabase db push
```

### Verify Migrations:
```bash
# Check migration status
supabase migration list

# Generate diff to verify
supabase db diff --local
```

## Post-Migration Setup

### 1. Create First Super Admin:
After running migrations, manually promote your first user to super admin:

```sql
-- Update your user role to super_admin
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'your-email@example.com';
```

### 2. Configure Role Permissions (Optional):
The default permissions are comprehensive, but you can customize them:

```sql
-- Example: Allow teachers to update student records
UPDATE public.role_permissions 
SET allowed = true 
WHERE role = 'teacher' 
  AND resource = 'students' 
  AND action = 'update';
```

### 3. Set Up Email Notifications (Optional):
Configure triggers for important events like role changes or student registrations.

## Development Guidelines

### Adding New Tables:
1. Always enable RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. Create appropriate policies for each role
3. Add audit logging if the table contains sensitive data
4. Create necessary indexes for performance
5. Add comprehensive comments for documentation

### Modifying Existing Tables:
1. Create a new migration file
2. Test changes in local environment first
3. Consider impact on existing RLS policies
4. Update audit triggers if needed
5. Update role permissions table if new actions are added

### Best Practices:
- Use UUIDs for primary keys
- Always include `created_at` and `updated_at` timestamps
- Use enums for constrained values
- Add CHECK constraints for data validation
- Create indexes for commonly queried columns
- Document all functions and triggers

## Troubleshooting

### Common Issues:

1. **RLS Policy Conflicts**: Check that policies don't overlap or contradict
2. **Permission Denied**: Verify user role and permissions in `role_permissions` table
3. **Trigger Errors**: Check that referenced functions exist and have proper security definer
4. **Index Performance**: Monitor query performance and add indexes as needed

### Debugging Queries:
```sql
-- Check user role and permissions
SELECT 
  p.role,
  rp.resource,
  rp.action,
  rp.allowed
FROM public.profiles p
LEFT JOIN public.role_permissions rp ON rp.role = p.role
WHERE p.id = auth.uid();

-- Check RLS policy evaluation
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM public.students;
```

## Migration Dependencies

### External Dependencies:
- PostgreSQL 13+ (for generated columns and advanced features)
- Supabase Auth system (`auth.users` table)
- UUID extension (usually enabled by default)

### Internal Dependencies:
1. The user profiles migration must run before the students migration
2. Both migrations depend on the Supabase Auth system being properly configured
3. The `auth.users` table must exist and be accessible

## Backup and Recovery

### Before Running Migrations:
```bash
# Backup current database
pg_dump "postgresql://..." > backup_$(date +%Y%m%d_%H%M%S).sql

# Test migrations on a copy first
```

### Recovery from Failed Migration:
```bash
# Rollback to previous state
supabase db reset

# Restore from backup if needed
psql "postgresql://..." < backup_file.sql
```

