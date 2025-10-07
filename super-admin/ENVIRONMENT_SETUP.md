# Environment Setup Guide

## Environment Variables

Use `.env.local` for development (ignored by git), and configure production variables in Vercel Project Settings.

See templates: `.env.example` (development) and `.env.production.example` (production).

### Required (client)
```env
VITE_SUPABASE_URL= # Supabase project URL
VITE_SUPABASE_ANON_KEY= # Supabase anon public key
```

### Required (deployment)
```env
VITE_APP_URL=http://localhost:3001 # dev
VITE_ENV=development               # dev | staging | production
```

### Optional
```env
VITE_API_BASE_URL=/api
VITE_APP_NAME=Airbotix Super Admin
VITE_ENABLE_ANALYTICS=false
```

### Server-only (Vercel only, do not commit)
```
SUPABASE_SERVICE_ROLE_KEY= # Service role key, server-side only
```

## Supabase Database Setup

Execute the following SQL in your Supabase SQL Editor:

```sql
-- Extend auth.users with custom profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('super_admin', 'admin', 'teacher')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles  
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'teacher');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Authentication Setup

1. **Configure Supabase Authentication**:
   - Go to your Supabase dashboard
   - Navigate to Authentication > Settings
   - Configure your Site URL and Redirect URLs
     - Development Site URL: `http://localhost:3001`
     - Production Site URL: `https://admin.airbotix.ai`
     - Redirect URL: `<site-url>/admin/auth/callback`
       - Example: `https://admin.airbotix.ai/admin/auth/callback`
   - Enable email authentication and Google OAuth

2. **Set up Google OAuth** (optional):
   - Go to Google Cloud Console
   - Create credentials for OAuth 2.0
   - Add the client ID and secret to Supabase Auth settings

3. **Configure email templates** (optional):
   - Customize magic link and password reset email templates
   - Set up SMTP for custom email sending

## Role Management

After setting up authentication, you'll need to manually assign roles to users:

1. **Create your first super admin**:
   - Sign up through the application
   - Go to Supabase dashboard > Table Editor > profiles
   - Find your user record and change the role to 'super_admin'

2. **Role hierarchy**:
   - `super_admin`: Full access to all features
   - `admin`: Can manage students, teachers, workshops, courses, and content
   - `teacher`: Limited access to assigned workshops and student data

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

The application is configured for GitHub Pages deployment:

```bash
npm run deploy
```

Make sure to set up your GitHub repository secrets with the environment variables if needed.
