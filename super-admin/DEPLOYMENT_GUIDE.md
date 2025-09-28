# Super Admin System Deployment Guide

This guide provides step-by-step instructions for deploying the simplified super admin system.

## Prerequisites

- Supabase project with admin access
- Node.js 18+ installed
- Git repository access
- Domain/hosting platform access

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] `.env` file configured with correct Supabase credentials
- [ ] Supabase auth settings configured
- [ ] Email templates customized (optional)

### 2. Code Review
- [ ] All TODO tasks completed
- [ ] No console errors in development
- [ ] Linting passes without errors
- [ ] TypeScript compilation successful

### 3. Database Preparation
- [ ] Backup existing database (if applicable)
- [ ] Test migration in development environment
- [ ] Verify data integrity after migration

## Deployment Steps

### Step 1: Database Migration

1. **Apply the simplification migration**:
   ```bash
   cd super-admin
   supabase db push
   ```

2. **Verify migration success**:
   ```sql
   -- Check remaining tables
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   
   -- Should show: profiles, students, profiles_audit_log, students_audit_log, role_permissions
   ```

3. **Verify RLS policies**:
   ```sql
   -- Check policies are active
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

### Step 2: Environment Configuration

1. **Update production environment variables**:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_APP_NAME="Airbotix Super Admin"
   VITE_APP_ENVIRONMENT="production"
   ```

2. **Configure Supabase Auth settings**:
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/admin`
   - Enable email authentication
   - Disable unused providers

### Step 3: Build & Deploy

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Test the build locally**:
   ```bash
   npm run preview
   ```

4. **Deploy to your hosting platform**:

   **For Vercel**:
   ```bash
   npx vercel --prod
   ```

   **For Netlify**:
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

   **For GitHub Pages**:
   ```bash
   npm run deploy
   ```

### Step 4: Post-Deployment Setup

1. **Setup first super admin**:
   ```sql
   -- Replace with your email
   SELECT public.promote_to_super_admin('your-email@example.com');
   ```

2. **Test login flow**:
   - Navigate to your deployed site
   - Request magic link with your email
   - Verify email receipt and link functionality
   - Confirm dashboard access

3. **Verify functionality**:
   - Test student management features
   - Check user role permissions
   - Verify data integrity

## Environment-Specific Configuration

### Development
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
VITE_APP_ENVIRONMENT="development"
```

### Staging
```env
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-anon-key
VITE_APP_ENVIRONMENT="staging"
```

### Production
```env
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key
VITE_APP_ENVIRONMENT="production"
```

## Hosting Platform Specific Instructions

### Vercel Deployment

1. **Connect repository**:
   - Import project from Git
   - Configure build settings

2. **Environment variables**:
   - Add all `VITE_*` variables in dashboard
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Domain configuration**:
   - Add custom domain
   - Update Supabase redirect URLs

### Netlify Deployment

1. **Site settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment variables**:
   - Add in site settings > Environment variables

3. **Redirects configuration** (create `_redirects` in public folder):
   ```
   /*    /index.html   200
   ```

### GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository settings
   - Enable Pages from Actions

2. **GitHub Actions workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## Security Considerations

### Production Security Checklist
- [ ] HTTPS enforced on all routes
- [ ] Environment variables secured
- [ ] Database RLS policies active
- [ ] API keys have minimal required permissions
- [ ] Regular security updates scheduled

### Supabase Security Settings
1. **Database settings**:
   - Enable RLS on all tables
   - Review and minimize API permissions
   - Set up database backups

2. **Auth settings**:
   - Configure rate limiting
   - Set appropriate session timeouts
   - Enable email confirmation if needed

3. **API settings**:
   - Restrict API access to your domain
   - Enable CORS for your domain only
   - Monitor API usage

## Monitoring & Maintenance

### Set up monitoring for:
- [ ] Application uptime
- [ ] Authentication success rates
- [ ] Database performance
- [ ] Error rates and logs

### Regular maintenance tasks:
- [ ] Update dependencies monthly
- [ ] Review user access quarterly
- [ ] Database performance analysis
- [ ] Security audit annually

## Rollback Plan

If issues occur after deployment:

### Immediate Rollback
1. **Revert to previous deployment**:
   - Use hosting platform's rollback feature
   - Or redeploy previous Git commit

2. **Database rollback** (if needed):
   ```sql
   -- Use the rollback migration if necessary
   -- Follow instructions in 20250925000002_rollback_simplification.sql
   ```

### Gradual Recovery
1. Identify specific issues
2. Fix in development environment
3. Test thoroughly
4. Deploy fixes incrementally

## Troubleshooting

### Common Deployment Issues

**Build Failures**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variable Issues**:
- Verify all `VITE_` prefixed variables
- Check spelling and values
- Ensure no trailing spaces

**Database Connection Issues**:
- Verify Supabase project is active
- Check API keys are correct
- Confirm RLS policies allow access

**Authentication Issues**:
- Verify redirect URLs in Supabase
- Check email service configuration
- Confirm user roles in database

### Performance Optimization

1. **Enable caching**:
   - Set appropriate cache headers
   - Use CDN for static assets

2. **Optimize bundle size**:
   ```bash
   # Analyze bundle
   npx vite-bundle-analyzer
   ```

3. **Database optimization**:
   - Review query performance
   - Ensure proper indexing
   - Monitor connection pooling

## Support & Documentation

### For Technical Issues:
1. Check browser console logs
2. Review Supabase project logs
3. Verify network requests in dev tools
4. Consult `TESTING_GUIDE.md`

### For User Management:
1. Use `scripts/setup-admin.md` for admin setup
2. Reference user role documentation
3. Check permission matrices in code

Remember to test all changes in a staging environment before deploying to production!
