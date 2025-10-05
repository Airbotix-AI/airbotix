-- ============================================================================
-- Create Initial Super Admin User
-- ============================================================================
-- This migration creates the initial super admin profile for the system.
-- 
-- PREREQUISITES:
-- 1. User must already exist in auth.users (signup via application first)
-- 2. All previous migrations must be applied successfully
--
-- Super Admin Email: alexlyz1124@gmail.com
-- ============================================================================

DO $$
DECLARE
  admin_user_id UUID;
  admin_email TEXT := 'alexlyz1124@gmail.com';
  admin_name TEXT := 'Alex Liu';
BEGIN
  -- Step 1: Check if user exists in auth.users
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email
  LIMIT 1;

  -- Step 2: Validate user exists
  IF admin_user_id IS NULL THEN
    RAISE NOTICE '⚠️  User % does not exist in auth.users. Skipping super admin creation.', admin_email;
    RAISE NOTICE 'ℹ️  This is normal for local testing. User must signup first in production.';
    RETURN; -- Exit gracefully without error
  END IF;

  RAISE NOTICE 'Found user in auth.users: % (ID: %)', admin_email, admin_user_id;

  -- Step 3: Insert or update profile with super_admin role
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    admin_user_id,
    admin_email,
    admin_name,
    'super_admin',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET 
      role = 'super_admin',
      is_active = true,
      updated_at = NOW();

  -- Step 4: Verify super admin was created/updated
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = admin_user_id 
    AND role = 'super_admin' 
    AND is_active = true
  ) THEN
    RAISE NOTICE '✅ SUCCESS: Super admin profile created/updated successfully!';
    RAISE NOTICE 'Email: %', admin_email;
    RAISE NOTICE 'User ID: %', admin_user_id;
    RAISE NOTICE 'Role: super_admin';
    RAISE NOTICE 'Status: active';
  ELSE
    RAISE EXCEPTION 'Failed to create/update super admin profile';
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ ERROR: %', SQLERRM;
    RAISE;
END $$;

-- ============================================================================
-- Post-Migration Verification
-- ============================================================================
-- The following comment serves as verification SQL that can be run separately

/*
-- Verify super admin was created successfully
SELECT 
  id,
  email,
  full_name,
  role,
  is_active,
  created_at
FROM public.profiles
WHERE email = 'alexlyz1124@gmail.com';

-- Expected result:
-- - role = 'super_admin'
-- - is_active = true

-- Verify permissions
SELECT 
  resource,
  action,
  allowed
FROM public.role_permissions
WHERE role = 'super_admin'
ORDER BY resource, action;

-- Expected result:
-- - Multiple rows showing full permissions for super_admin role
*/

