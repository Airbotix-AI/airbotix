# Airbotix - AI and Robotics Education Platform

A comprehensive monorepo for the Airbotix platform, providing AI and robotics education for K-12 students through interactive workshops and partnerships with schools and organizations.

## 🏗️ Monorepo Structure

```
/
├── src/              # 🌐 Public Site (React + Vite + Tailwind)
├── public/
├── package.json
├── vite.config.ts
├── .env.example
└── README.md

/admin/               # 🔧 Admin Dashboard (React + Vite + Tailwind)
├── src/
├── public/
├── package.json
├── vite.config.ts
├── .env.admin.example
└── README.md

/docs/db/            # 🗄️ Database Artifacts
├── schema.sql
├── rls.sql
├── seed.sql
└── README-db.md
```

## 🚀 Quick Start

### Public Site (Root Directory)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Admin Dashboard
```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Start development server (runs on port 3001)
npm run dev

# Build for production
npm run build
```

### Database Setup
```bash
# 1. Set up Supabase project at https://supabase.com
# 2. Run the SQL files in order:
#    - docs/db/schema.sql
#    - docs/db/rls.sql
#    - docs/db/seed.sql (optional, for development)
# 3. Configure environment variables in both apps
```

## 🎯 Features

### Public Site
- **Home Page**: Hero section with mission and featured workshops
- **Workshops**: Browse and view detailed workshop information
- **Partners**: Showcase of educational partners and collaboration opportunities
- **About**: Information about Airbotix and our mission
- **Contact**: Contact form and partnership inquiries
- **HashRouter**: GitHub Pages compatible routing

### Admin Dashboard
- **Dashboard**: Overview of workshops, partners, and registrations
- **Workshop Management**: Create and manage workshop content
- **Partner Management**: Manage educational partnerships
- **User Management**: Handle user roles and permissions
- **Content Management**: Update site content and media
- **Supabase Auth**: Secure authentication (coming soon)

### Database
- **User Management**: Role-based access control
- **Workshop System**: Complete workshop and session management
- **Partner Network**: Partner organization management
- **Registration System**: Workshop registration and attendance tracking
- **Content Management**: Dynamic content and media management
- **Security**: Row-level security with Supabase RLS

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing (HashRouter for public, BrowserRouter for admin)

### Backend & Database
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Row Level Security**: Fine-grained access control
- **Authentication**: Supabase Auth (to be integrated in admin)

### Deployment
- **Public Site**: GitHub Pages (static hosting)
- **Admin Dashboard**: Vercel/Netlify (to be configured)
- **Database**: Supabase (managed PostgreSQL)

## 📋 Development Scripts

### Root (Public Site)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

### Admin Dashboard
- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run preview` - Preview production build on port 3001
- `npm run lint` - Run ESLint

## 🌱 Environment Variables

### Public Site (`.env`)
```env
VITE_SITE_NAME="Airbotix"
VITE_SITE_URL="https://airbotix.github.io"
VITE_CONTACT_EMAIL="info@airbotix.com"
VITE_CONTACT_PHONE="+1-555-0123"
```

### Admin Dashboard (`.env`)
```env
VITE_APP_NAME="Airbotix Admin"
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
VITE_API_BASE_URL="https://api.airbotix.com"
```

## 🚀 Deployment

### Public Site → GitHub Pages
1. Push to main branch
2. Run `npm run deploy`
3. Site will be available at your GitHub Pages URL

### Admin Dashboard → Vercel/Netlify
1. Connect your repository to Vercel or Netlify
2. Set build directory to `admin`
3. Configure environment variables
4. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- 📧 Email: info@airbotix.com
- 🐛 Issues: [GitHub Issues](https://github.com/airbotix/airbotix-website/issues)
- 📖 Documentation: See individual README files in each directory

## 🗺️ Roadmap

- [ ] Complete Supabase Auth integration in admin dashboard
- [ ] Add real-time features with Supabase subscriptions
- [ ] Implement workshop registration system
- [ ] Add payment processing for workshops
- [ ] Mobile app for workshop participants
- [ ] Advanced analytics and reporting
