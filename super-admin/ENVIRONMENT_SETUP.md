# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root of the super-admin folder with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://fauerqsvboamciwvlvxw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhdWVycXN2Ym9hbWNpd3Zsdnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MjM5MjMsImV4cCI6MjA3MjI5OTkyM30.l72vYLKNZa-qA4LUioliagGu1xwJNDYIO6n2C5biO0k

# Application Configuration (Optional)
VITE_APP_NAME="Airbotix Super Admin"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENVIRONMENT="development"

# API Configuration (Optional)
VITE_API_BASE_URL="/api"

# Feature Flags (Optional)
VITE_ENABLE_ANALYTICS="true"
VITE_ENABLE_NOTIFICATIONS="true"
VITE_ENABLE_EXPORT_FEATURES="true"
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
   - Configure your site URL and redirect URLs
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
