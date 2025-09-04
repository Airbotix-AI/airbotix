# Airbotix Super Admin Management System

A comprehensive admin dashboard for managing the Airbotix educational platform. Built with React, TypeScript, and Supabase.

## 🚀 Features

- **Authentication**: Secure login with Supabase Auth (Magic Links + Google OAuth)
- **Student Management**: Track and manage student information, enrollments, and progress
- **Teacher Management**: Manage instructors, their courses, and teaching assignments
- **Workshop Management**: Create and organize educational workshops with enrollment tracking
- **Course Management**: Comprehensive course creation and management system
- **Content Management**: Create and publish educational content (articles, videos, tutorials)
- **Dashboard Analytics**: Overview of key metrics and recent activities
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **Routing**: React Router DOM v6 (HashRouter for GitHub Pages)
- **Authentication**: Supabase Auth
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
super-admin/
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components (AdminLayout)
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Page components (Dashboard, Students, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # String constants (MANDATORY)
│   ├── services/           # API service functions
│   └── assets/             # Static assets
├── public/                 # Public assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the super-admin directory:
   ```bash
   cd super-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   # Create .env file with:
   VITE_SUPABASE_URL=https://nbnuacfkmxwyvlnjycnt.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 🔐 Authentication

The application uses Supabase authentication with:

- **Magic Link Authentication**: Passwordless login via email
- **Google OAuth**: Social login with Google
- **Session Management**: Automatic session handling and persistence

### Login Access

Super Admin access is controlled through Supabase. Ensure users have appropriate permissions in your Supabase project.

## 📊 Features Overview

### Dashboard
- Key metrics (students, teachers, workshops, courses)
- Revenue tracking
- Recent activity feed
- Quick access to main functions

### Student Management
- Student profiles and contact information
- Course enrollment tracking
- Workshop attendance history
- Status management (active/inactive/suspended)

### Teacher Management
- Instructor profiles and specializations
- Course assignments
- Workshop scheduling
- Performance tracking

### Workshop Management
- Workshop creation and scheduling
- Enrollment management
- Capacity tracking
- Material and requirement specifications

### Course Management
- Course creation with detailed syllabus
- Pricing and enrollment management
- Category and difficulty level organization
- Prerequisites and learning objectives

### Content Management
- Multi-format content support (articles, videos, tutorials)
- Publishing workflow (draft → review → published)
- Tag-based organization
- Featured content highlighting

## 🎨 Design System

The application follows a consistent design system using:

- **Colors**: CSS custom properties for theming
- **Components**: shadcn/ui component library
- **Typography**: Tailwind typography utilities
- **Icons**: Lucide React icons
- **Animations**: Custom CSS animations and Tailwind utilities

## 🔒 Security

- Environment variables for sensitive configuration
- Supabase Row Level Security (RLS) policies
- Client-side route protection
- Secure authentication flow

## 📱 Responsive Design

The interface is fully responsive with:
- Mobile-first design approach
- Collapsible sidebar for mobile
- Touch-friendly interactions
- Optimized table layouts for small screens

## 🚀 Deployment

The application is configured for GitHub Pages deployment:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

The built application uses HashRouter for compatibility with GitHub Pages static hosting.

## 🔧 Configuration

### Vite Configuration
- Port 3001 to avoid conflicts with main homepage
- Base path for GitHub Pages deployment
- Path aliases for clean imports

### Tailwind Configuration
- Custom color scheme
- shadcn/ui integration
- Custom utility classes

### TypeScript Configuration
- Strict type checking
- Path mapping for imports
- Modern ES2020 target

## 📚 Code Standards

### Mandatory Rules
- **Maximum 1000 lines per file**
- **All strings must be named constants** (see `src/constants/strings.ts`)
- **TypeScript interfaces required** for all data structures
- **SOLID principles** and component composition

### File Organization
- Feature-based component organization
- Consistent naming conventions
- Proper import/export patterns

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure port 3001 is available or modify in `vite.config.ts`
2. **Environment variables**: Verify `.env` file is properly configured
3. **Supabase connection**: Check network connectivity and credentials
4. **Build errors**: Ensure all dependencies are installed

### Development Tips

- Use React DevTools for debugging
- Check browser console for errors
- Verify Supabase dashboard for authentication issues
- Use TypeScript compiler for type checking

## 🤝 Contributing

1. Follow the established code standards
2. Maintain the string constants pattern
3. Add proper TypeScript types
4. Test responsive behavior
5. Update documentation as needed

## 📄 License

This project is part of the Airbotix educational platform.
