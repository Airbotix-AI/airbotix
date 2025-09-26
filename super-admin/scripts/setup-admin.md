# Super Admin Setup Guide

After deploying the simplified system, follow these steps to set up your first super admin user:

## Method 1: Using Supabase SQL Editor (Recommended)

1. **Sign up first**: Use the login page to sign up with your email
2. **Open Supabase Dashboard**: Go to your Supabase project dashboard
3. **Open SQL Editor**: Navigate to SQL Editor in the sidebar
4. **Run the promotion query**:

```sql
-- Replace 'your-email@example.com' with your actual email
SELECT public.promote_to_super_admin('your-email@example.com');
```

5. **Verify the change**:

```sql
-- Check your new role
SELECT email, role, is_active 
FROM public.profiles 
WHERE email = 'your-email@example.com';
```

## Method 2: Direct Database Update

If the function doesn't work, you can directly update the database:

```sql
-- Update user role to super_admin
UPDATE public.profiles 
SET role = 'super_admin', updated_at = NOW()
WHERE email = 'your-email@example.com';

-- Verify the change
SELECT email, role, is_active 
FROM public.profiles 
WHERE email = 'your-email@example.com';
```

## Method 3: Using psql (If you have direct database access)

```bash
# Connect to your database
psql "your-supabase-connection-string"

# Run the promotion
SELECT public.promote_to_super_admin('your-email@example.com');

# Exit
\q
```

## Verification

After promoting yourself to super admin:

1. **Log out** of the admin system if you're logged in
2. **Log back in** using the magic link
3. **Check dashboard access** - you should now have full access
4. **Verify in profile settings** - your role should show as "super_admin"

## Troubleshooting

### "User not found" error
- Make sure you've signed up first using the login page
- Check the email spelling matches exactly
- Verify the user exists in the profiles table

### "Access denied" after promotion
- Clear browser cache and cookies
- Log out completely and log back in
- Check that the role was actually updated in the database

### Magic link not working
- Check spam/junk folder
- Make sure your Supabase auth configuration is correct
- Verify the redirect URL matches your domain

## Security Notes

- Only promote trusted users to super_admin
- Regular users will have 'teacher' role by default
- Super admins can manage all other users through the admin interface
- Keep a record of who has super admin access

## Next Steps

Once you have super admin access:

1. **Review user permissions** in the dashboard
2. **Add additional admin users** if needed
3. **Test student management features**
4. **Configure any additional settings**

For any issues, check the browser console and Supabase logs for error messages.
