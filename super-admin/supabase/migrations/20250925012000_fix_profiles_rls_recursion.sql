-- Fix RLS recursion on profiles caused by self-referencing subqueries in policies

-- Drop problematic policies (ignore if missing)
DO $$
BEGIN
  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_super_admin_full_access';
  IF FOUND THEN EXECUTE 'DROP POLICY "profiles_super_admin_full_access" ON public.profiles'; END IF;

  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_admin_manage_non_admin';
  IF FOUND THEN EXECUTE 'DROP POLICY "profiles_admin_manage_non_admin" ON public.profiles'; END IF;

  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_user_own_profile';
  IF FOUND THEN EXECUTE 'DROP POLICY "profiles_user_own_profile" ON public.profiles'; END IF;

  PERFORM 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_user_update_own';
  IF FOUND THEN EXECUTE 'DROP POLICY "profiles_user_update_own" ON public.profiles'; END IF;
END $$;

-- Recreate safe, non-recursive policies using SECURITY DEFINER helpers

-- 1) Read access: users can read their own row; admins/super_admins can read all
CREATE POLICY "profiles_read_access" ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin_or_above()
    OR public.is_super_admin()
  );

-- 2) Update own profile: no self-referencing sub-selects
CREATE POLICY "profiles_update_self" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3) Admins can update teacher profiles (but not other admins/super_admins)
CREATE POLICY "profiles_admin_manage_teacher" ON public.profiles
  FOR UPDATE
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above() AND role = 'teacher');

-- 4) Super admins full access
CREATE POLICY "profiles_super_admin_full" ON public.profiles
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());


