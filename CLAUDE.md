# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development Server
- `npm run dev` - Start development server (opens at http://localhost:3000)
- `npm run preview` - Preview production build locally

### Build & Quality
- `npm run build` - Build for production (output: dist/)
- `npm run lint` - Run ESLint checks with TypeScript support
- `npm run deploy` - Build and deploy to GitHub Pages

### Development Workflow
Always run lint after making changes to ensure code quality:
```bash
npm run lint
```

## Project Architecture

### Tech Stack
- **React 18** with **TypeScript** for type safety
- **Vite** as build tool for fast development
- **TailwindCSS** for styling with custom design system
- **React Router** for client-side navigation
- **GitHub Pages** deployment with automated CI/CD

### Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer  
│   └── Layout.tsx      # Main layout wrapper
├── pages/              # Page components (routes)
├── data/               # Static data (workshops.ts)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main router setup
```

### Routing Setup
The app uses React Router with these main routes:
- `/` - Home page
- `/workshops` - Workshop listing
- `/workshops/:id` - Individual workshop details
- `/about` - About page
- `/contact` - Contact form
- `/book` - Booking page

### Key Data Layer
Workshop data is centralized in `src/data/workshops.ts` with comprehensive TypeScript types including:
- Workshop metadata (title, duration, target audience)
- Detailed syllabus with weekly breakdown
- Assessment criteria and learning outcomes
- Media attachments (videos/photos)
- SEO metadata

### TypeScript Configuration
- Path aliases configured (`@/*` maps to `./src/*`)
- Strict mode enabled with comprehensive linting
- Modern ES2020 target with DOM types

## Styling Guidelines

### TailwindCSS Usage
- Custom color palette in tailwind.config.js
- Responsive design patterns throughout
- Component-based styling approach
- Use @layer components for reusable styles

### Code Style Rules (from rules.md)
- **Components**: PascalCase (UserProfile)
- **Hooks**: camelCase with 'use' prefix (useUserData)
- **Constants**: SCREAMING_SNAKE_CASE (API_BASE_URL)
- **Files**: Match component names exactly

### Component Patterns
Follow the established patterns:
- Proper TypeScript interfaces for props
- Default parameter values where appropriate
- Consistent className organization (base classes, variants, responsive)
- Proper error boundaries and loading states

## Development Standards

### Coding Principles (Enforced Rules)
**MANDATORY**: All code must follow these principles documented in `rules/`

#### SOLID Principles
- **Single Responsibility**: Each component/function has one clear purpose
- **Open/Closed**: Components extensible through props, not modification
- **Interface Segregation**: Create focused, specific interfaces
- **Dependency Inversion**: Depend on abstractions, not implementations

#### Core Rules
- **KISS**: Keep solutions simple, avoid over-engineering
- **DRY**: No code duplication, extract common functionality
- **File Size Limit**: Maximum 1000 lines per file (hard limit)
- **No Magic Strings**: All strings must be named constants
- **TypeScript Interfaces**: Required for all data structures

### File Organization Rules
- **1000-line maximum** per TypeScript file
- Break down large files into focused components
- Extract custom hooks for complex state logic
- Separate utilities into dedicated files
- Use feature-based organization for related components

### String Constants (Mandatory)
```typescript
// ✅ Required - All strings as constants
const API_ENDPOINTS = {
  WORKSHOPS: '/api/workshops',
  BOOKINGS: '/api/bookings',
} as const

const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  REQUIRED_FIELD: 'This field is required',
} as const

// ❌ Forbidden - Magic strings
const url = '/api/workshops'
const error = 'Please enter a valid email address'
```

### TypeScript Interface Requirements
```typescript
// ✅ Required - All components must have interfaces
interface WorkshopCardProps {
  workshop: Workshop
  onBookClick: (id: string) => void
  isLoading?: boolean
}

const WorkshopCard = ({ workshop, onBookClick, isLoading }: WorkshopCardProps) => {
  // Component logic
}

// ❌ Forbidden - Inline types
const WorkshopCard = ({ workshop, onBookClick, isLoading }: {
  workshop: Workshop
  onBookClick: (id: string) => void
  isLoading?: boolean
}) => {
  // Component logic
}
```

### Git Workflow
- Follow Conventional Commits format
- Branch naming: `feature/description`, `fix/issue-name`
- Small, focused PRs with clear descriptions
- Self-review before requesting team review

### Code Quality Enforcement
- No unused imports or variables
- Proper error handling throughout
- TypeScript strict mode enabled
- ESLint rules strictly enforced
- All rules violations must be fixed before merge

### Performance Considerations
- Code splitting with React.lazy() for routes
- Optimized images with proper loading attributes
- Memoization for expensive calculations
- Bundle size monitoring (target: <1MB gzipped)

## Deployment

### GitHub Pages Setup
- Base path configured as `/airbotix-website/`
- Automated deployment via `npm run deploy`
- Uses gh-pages branch for hosting
- Custom domain support available

### Environment Variables
- `VITE_FORMSPREE_ID` - Contact form integration
- `VITE_CONTACT_EMAIL` - Fallback email for contact

## Important Notes

- This is an educational website for Airbotix (AI & Robotics education for K-12)
- **ALL DEVELOPMENT RULES** are documented in the `rules/` directory:
  - `rules/coding-principles.md` - SOLID, KISS, DRY principles
  - `rules/file-organization.md` - 1000-line limit and breakdown strategies
  - `rules/typescript-standards.md` - Mandatory interface requirements
  - `rules/string-constants.md` - No magic strings rule
- Workshop data is the primary content type with rich metadata
- Mobile-first responsive design approach
- Professional, educational brand tone throughout
- **Code Review**: All PRs must verify compliance with rules/ documentation