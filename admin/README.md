# Airbotix Admin Dashboard

The administrative interface for the Airbotix AI and Robotics education platform. This React application provides tools for managing workshops, partners, users, and content.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.admin.example .env

# Start development server
npm run dev
```

The admin dashboard will be available at `http://localhost:3001`

## 🎯 Features

### Current Features
- **Dashboard Overview**: Summary of workshops, partners, and activity
- **Workshop Management**: Create, edit, and manage workshop content
- **Partner Management**: Manage educational partners and organizations
- **User Authentication**: Placeholder for Supabase Auth integration

### Planned Features
- **User Management**: Manage user roles and permissions
- **Registration Management**: Handle workshop registrations and attendance
- **Content Management**: Update site content and media
- **Analytics**: Workshop performance and user engagement metrics
- **Notifications**: Email and in-app notifications

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and HMR
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Supabase**: Database and authentication (to be integrated)

## 📋 Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy command (configured for Vercel/Netlify)

## ⚙️ Environment Variables

Copy `.env.admin.example` to `.env` and configure:

```env
# App Configuration
VITE_APP_NAME="Airbotix Admin"
VITE_APP_URL="https://admin.airbotix.com"

# Supabase Configuration (to be added)
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"

# API Configuration
VITE_API_BASE_URL="https://api.airbotix.com"
VITE_API_VERSION="v1"

# Development
VITE_APP_ENV="development"
VITE_DEBUG_MODE="true"
```

## 🏗️ Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   └── Login.tsx       # Login page
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🔐 Authentication

The admin dashboard is designed to work with Supabase Auth:

### Planned Authentication Flow
1. **Login Page**: Email/password authentication
2. **Role-based Access**: Admin, teacher, and partner roles
3. **Protected Routes**: Require authentication
4. **Session Management**: Automatic token refresh

### Current Status
- Login page is a placeholder
- Supabase Auth integration is planned
- All routes are currently accessible

## 📊 Dashboard Features

### Overview Cards
- Total workshops created
- Active workshop sessions
- Registered participants
- Partner organizations

### Quick Actions
- Create new workshop
- Schedule workshop session
- Add new partner
- View recent registrations

### Data Tables
- Workshop management with filters
- Partner organization list
- User management (coming soon)
- Registration tracking (coming soon)

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set the root directory to `admin`
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `admin/dist`
4. Configure environment variables in Netlify dashboard

### Manual Deployment
```bash
# Build the application
npm run build

# Upload the dist/ folder to your hosting provider
```

## 🧪 Development

### Code Style
- ESLint configuration for React and TypeScript
- Prettier for code formatting
- Tailwind CSS for styling

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Define types in `src/types/`
4. Add routes in `App.tsx`

### Database Integration
1. Install Supabase client: `npm install @supabase/supabase-js`
2. Configure Supabase client in `src/utils/supabase.ts`
3. Create custom hooks for data fetching
4. Implement authentication guards

## 🔧 Configuration

### Tailwind CSS
The admin dashboard uses a customized Tailwind configuration:
- Extended color palette for admin themes
- Custom components for dashboard elements
- Responsive design utilities

### Vite Configuration
- React plugin for JSX support
- Development server on port 3001
- Build optimization for production

### TypeScript
- Strict mode enabled
- Path aliases for clean imports
- Type checking for all components

## 📝 API Integration

### Supabase Integration (Planned)
```typescript
// Example API calls
import { supabase } from '../utils/supabase'

// Fetch workshops
const { data: workshops } = await supabase
  .from('workshops')
  .select('*')
  .eq('is_published', true)

// Create workshop
const { data, error } = await supabase
  .from('workshops')
  .insert([{ title, description, content }])
```

### Error Handling
- Global error boundary for React errors
- API error handling with user-friendly messages
- Loading states for async operations

## 🆘 Support

- Check the main project README for general support
- Review the database documentation in `docs/db/README-db.md`
- Submit issues on the main repository

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic dashboard layout
- [x] Navigation structure
- [x] Placeholder components

### Phase 2 (Next)
- [ ] Supabase Auth integration
- [ ] Workshop CRUD operations
- [ ] Partner management
- [ ] User role management

### Phase 3 (Future)
- [ ] Real-time updates
- [ ] Advanced analytics
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Mobile responsive improvements