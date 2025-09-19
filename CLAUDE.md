# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Main Website (root directory)
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production (TypeScript + Vite)
npm run lint     # Run ESLint checks with TypeScript support
npm run preview  # Preview production build locally
npm run deploy   # Build and deploy to GitHub Pages
```

### Super Admin Application (`/super-admin/`)
```bash
cd super-admin
npm run dev      # Start admin server (http://localhost:3001)
npm run build    # Build admin for production
npm run lint     # Run ESLint checks
npm run preview  # Preview admin production build
npm run deploy   # Deploy admin to GitHub Pages
```

### Database Management (Super Admin)
```bash
cd super-admin
npx supabase migration new <name>  # Create new migration
npx supabase db reset              # Reset database with all migrations
```

## Project Architecture

This is a **monorepo** containing two separate React applications:

### 1. Main Website (`/`)
Public-facing educational website for Airbotix (AI & Robotics education for K-12)
- **Tech Stack**: React 18, TypeScript, Vite, TailwindCSS, React Router
- **Deployment**: GitHub Pages via automated CI/CD
- **Content**: Static data files in `src/data/` (workshops, blog posts, media)
- **Routes**: Home, Workshops, About, Contact, Media, Blog

### 2. Super Admin (`/super-admin/`)
Administrative management system with role-based access control
- **Tech Stack**: React 18, TypeScript, Vite, Supabase (PostgreSQL), TanStack Query
- **Authentication**: Supabase Auth with email/password
- **Database**: PostgreSQL with Row Level Security (RLS) policies
- **Key Features**: Student management, course management, audit logging

### Shared Configuration
- **TypeScript**: Strict mode with path aliases (`@/*` → `./src/*`)
- **ESLint**: Enforced code quality with no warnings allowed
- **Styling**: TailwindCSS with custom color palette
- **Node Version**: 20 (specified in CI/CD)

## Database Schema (Super Admin)

### Key Tables
- `profiles` - User profiles with roles (super_admin, admin, teacher)
- `students` - Student records with parent information
- `students_audit` - Audit log for all student changes
- `courses` - Workshop/course definitions
- `enrollments` - Student course enrollments

### Important Database Patterns
- All tables use UUID primary keys
- Row Level Security (RLS) enabled on all tables
- Audit logging for sensitive operations
- Role-based access control through `user_role` enum
- Soft deletes with `deleted_at` timestamps

## Development Standards

### 🚨 MANDATORY CODING RULES
**ALL AI coding tools (Claude Code, Cursor, Copilot) MUST follow the rules in `/rules/` directory**

The `/rules/` directory contains comprehensive coding standards organized by category:

#### Rule Categories:
1. **[General Principles](./rules/general/)** - SOLID, DRY, KISS, Readability, Error Handling
2. **[Frontend Rules](./rules/frontend/)** - React components, State management, TypeScript, Performance
3. **[Backend Rules](./rules/backend/)** - API design, Database patterns, Security, Services
4. **[Deployment Rules](./rules/deployment/)** - CI/CD, Build process, Environment management

#### Core Mandatory Rules (Non-negotiable):
- **SOLID Principles** - Applied to all code architecture
- **DRY** - Zero code duplication allowed
- **KISS** - Simplest solution that works
- **File Size** - Maximum 1000 lines per file
- **TypeScript** - Interfaces required for all data structures
- **Constants** - No magic strings/numbers allowed
- **Error Handling** - Explicit error handling required

#### Quick Reference Example:
```typescript
// ✅ REQUIRED - Named constants
const API_ENDPOINTS = {
  WORKSHOPS: '/api/workshops',
  BOOKINGS: '/api/bookings',
} as const

// ✅ REQUIRED - TypeScript interfaces
interface WorkshopCardProps {
  workshop: Workshop
  onBookClick: (id: string) => void
}

// ❌ FORBIDDEN - Magic strings, any type, inline types
const url = '/api/workshops'  // Use constant!
const data: any = {}          // Define interface!
```

**IMPORTANT**: Before writing ANY code, AI tools must read relevant rules from `/rules/` directory.

### Git Workflow
- Branch naming: `feature/description`, `fix/issue-name`
- Conventional Commits format
- CI/CD runs on push to main branch

## API Services (Super Admin)

### Supabase Integration
The Super Admin uses Supabase services organized by domain:
- `studentService.ts` - Student CRUD operations with audit logging
- `authService.ts` - Authentication and role management
- `courseService.ts` - Course/workshop management
- `enrollmentService.ts` - Student enrollment handling

All services use TypeScript interfaces and proper error handling.

## Environment Variables

### Main Website
- `VITE_FORMSPREE_ID` - Contact form integration
- `VITE_CONTACT_EMAIL` - Fallback contact email

### Super Admin
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Testing

**Note**: No testing framework is currently configured. When implementing tests, consider:
- Vitest for unit testing (compatible with Vite)
- React Testing Library for component testing
- Playwright or Cypress for E2E testing

## Important Context

### Main Website
- Workshop data is the primary content type with rich metadata
- Mobile-first responsive design approach
- Static data management through TypeScript files
- No backend API - all content is static

### Super Admin
- Protected routes require authentication
- Role-based permissions enforced at database level
- Audit trail for all student data modifications
- Real-time data synchronization via Supabase

### Performance Targets
- Bundle size: < 1MB gzipped
- Code splitting with React.lazy() for routes
- Memoization for expensive calculations