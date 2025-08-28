-- Row Level Security (RLS) Policies for Airbotix Database
-- These policies control access to data based on user roles and ownership

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is teacher or admin
CREATE OR REPLACE FUNCTION is_teacher_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert profiles" ON profiles
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (is_admin());

-- Partners policies
CREATE POLICY "Everyone can view active partners" ON partners
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all partners" ON partners
    FOR ALL USING (is_admin());

-- Workshops policies
CREATE POLICY "Everyone can view published workshops" ON workshops
    FOR SELECT USING (is_published = true);

CREATE POLICY "Teachers and admins can view all workshops" ON workshops
    FOR SELECT USING (is_teacher_or_admin());

CREATE POLICY "Teachers can create workshops" ON workshops
    FOR INSERT WITH CHECK (is_teacher_or_admin());

CREATE POLICY "Workshop creators can update their workshops" ON workshops
    FOR UPDATE USING (created_by = auth.uid() OR is_admin());

CREATE POLICY "Admins can delete workshops" ON workshops
    FOR DELETE USING (is_admin());

-- Workshop sessions policies
CREATE POLICY "Everyone can view workshop sessions" ON workshop_sessions
    FOR SELECT USING (true);

CREATE POLICY "Teachers and admins can create sessions" ON workshop_sessions
    FOR INSERT WITH CHECK (is_teacher_or_admin());

CREATE POLICY "Instructors can update their sessions" ON workshop_sessions
    FOR UPDATE USING (instructor_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can delete sessions" ON workshop_sessions
    FOR DELETE USING (is_admin());

-- Workshop registrations policies
CREATE POLICY "Users can view their own registrations" ON workshop_registrations
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view registrations for their sessions" ON workshop_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workshop_sessions 
            WHERE id = session_id AND instructor_id = auth.uid()
        ) OR is_admin()
    );

CREATE POLICY "Users can register for workshops" ON workshop_registrations
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update their own registrations" ON workshop_registrations
    FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Instructors can update registrations for their sessions" ON workshop_registrations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM workshop_sessions 
            WHERE id = session_id AND instructor_id = auth.uid()
        ) OR is_admin()
    );

-- Content pages policies
CREATE POLICY "Everyone can view published content" ON content_pages
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all content" ON content_pages
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage content" ON content_pages
    FOR ALL USING (is_admin());

-- Media policies
CREATE POLICY "Everyone can view media" ON media
    FOR SELECT USING (true);

CREATE POLICY "Teachers and admins can upload media" ON media
    FOR INSERT WITH CHECK (is_teacher_or_admin());

CREATE POLICY "Media uploaders can update their media" ON media
    FOR UPDATE USING (uploaded_by = auth.uid() OR is_admin());

CREATE POLICY "Admins can delete media" ON media
    FOR DELETE USING (is_admin());

-- Contact submissions policies
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all contact submissions" ON contact_submissions
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update contact submissions" ON contact_submissions
    FOR UPDATE USING (is_admin());

-- Create a function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();