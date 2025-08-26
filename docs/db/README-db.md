# Airbotix Database Documentation

This directory contains the database schema, security policies, and seed data for the Airbotix AI and Robotics education platform.

## Files Overview

- **`schema.sql`** - Complete database schema with tables, indexes, and triggers
- **`rls.sql`** - Row Level Security (RLS) policies for Supabase
- **`seed.sql`** - Sample data for development and testing
- **`README-db.md`** - This documentation file

## Database Architecture

The database is designed for use with Supabase (PostgreSQL) and includes the following main entities:

### Core Tables

#### `profiles`
Extends Supabase's `auth.users` with additional user information:
- User roles (student, teacher, admin, partner)
- School affiliation and grade level
- Profile metadata

#### `partners`
Organizations that host or sponsor workshops:
- Schools, educational organizations, and companies
- Contact information and partnership details
- Active/inactive status management

#### `workshops`
Workshop templates and content:
- Curriculum content and learning objectives
- Difficulty levels and grade ranges
- Materials and prerequisites
- Publishing status

#### `workshop_sessions`
Scheduled instances of workshops:
- Date, time, and location information
- Instructor and partner assignments
- Registration limits and status tracking

#### `workshop_registrations`
Student registrations for workshop sessions:
- Registration status and attendance tracking
- Notes and feedback

### Supporting Tables

#### `content_pages`
CMS functionality for dynamic content:
- Page content in JSON format
- SEO metadata
- Publishing workflow

#### `media`
File and asset management:
- Uploaded images, videos, and documents
- Metadata and access control

#### `contact_submissions`
Contact form submissions:
- Inquiry categorization
- Status tracking for follow-up

## Security Model

The database uses Supabase's Row Level Security (RLS) to control data access:

### User Roles

- **Student**: Can view published content, register for workshops, manage own profile
- **Teacher**: Can create and manage workshops, view registrations for their sessions
- **Admin**: Full access to all data and administrative functions
- **Partner**: Can view workshops and sessions related to their organization

### Key Security Features

- Users can only access their own personal data
- Workshop content visibility based on publication status
- Role-based access control for administrative functions
- Automatic profile creation on user signup

## Setup Instructions

### 1. Database Initialization

```sql
-- Run these files in order in your Supabase SQL editor:
-- 1. schema.sql
-- 2. rls.sql
-- 3. seed.sql (optional, for development)
```

### 2. Environment Variables

Make sure your application has these Supabase configuration variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Authentication Setup

The database is configured to work with Supabase Auth:
- User profiles are automatically created on signup
- Email confirmation can be enabled in Supabase settings
- Social login providers can be configured as needed

## Data Relationships

```
auth.users (Supabase)
    ↓
profiles
    ↓
├── workshops (created_by)
├── workshop_sessions (instructor_id)
├── workshop_registrations (student_id)
├── content_pages (created_by)
└── media (uploaded_by)

partners
    ↓
└── workshop_sessions (partner_id)

workshops
    ↓
└── workshop_sessions (workshop_id)
```

## Common Queries

### Get upcoming workshops for a partner
```sql
SELECT ws.*, w.title, w.description
FROM workshop_sessions ws
JOIN workshops w ON ws.workshop_id = w.id
WHERE ws.partner_id = $1
  AND ws.start_time > NOW()
ORDER BY ws.start_time;
```

### Get user's workshop registrations
```sql
SELECT wr.*, ws.title, ws.start_time, ws.location
FROM workshop_registrations wr
JOIN workshop_sessions ws ON wr.session_id = ws.id
WHERE wr.student_id = auth.uid()
ORDER BY ws.start_time DESC;
```

### Get published workshops by grade level
```sql
SELECT * FROM workshops
WHERE is_published = true
  AND min_grade <= $1
  AND max_grade >= $1
ORDER BY title;
```

## Maintenance

### Regular Tasks

1. **Archive old sessions**: Move completed workshop sessions to archive tables
2. **Clean up media**: Remove unused media files periodically
3. **Update statistics**: Refresh materialized views for reporting
4. **Backup verification**: Ensure Supabase backups are working correctly

### Performance Monitoring

Key indexes are created for common query patterns. Monitor query performance and add additional indexes as needed based on usage patterns.

### Data Migration

When updating the schema:
1. Test changes in a development environment
2. Use Supabase migrations for version control
3. Backup data before applying changes
4. Update RLS policies if table structure changes

## Support

For questions about the database schema or setup:
1. Check the Supabase documentation
2. Review the RLS policies for access issues
3. Test queries in the Supabase SQL editor
4. Contact the development team for schema changes