# Super Admin - Vercel Deployment Guide

## Overview
- Framework: Vite + React
- Build command: `npm run build`
- Output directory: `dist`
- Production domain: `https://admin.airbotix.ai`

## 1) Vercel Project Settings
- Framework preset: Other
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm ci` (or default)
- Node.js Version: 18+ (set via `engines.node` in `package.json`)

### Environment Variables (Production)
- VITE_SUPABASE_URL: your prod Supabase URL
- VITE_SUPABASE_ANON_KEY: your prod anon key
- VITE_APP_URL: https://admin.airbotix.ai
- VITE_ENV: production
- SUPABASE_SERVICE_ROLE_KEY: only if used by serverless functions (never exposed client-side)

For Preview/Development deployments, set appropriate values per environment.

## 2) Supabase Auth Settings
- Site URL: `https://admin.airbotix.ai`
- Redirect URL: `https://admin.airbotix.ai/admin/auth/callback`
- Development equivalents:
  - Site URL: `http://localhost:3001`
  - Redirect URL: `http://localhost:3001/admin/auth/callback`

## 3) SPA routing on Vercel
- `vercel.json` includes rewrites to `index.html` for client-side routing.
- Security headers added (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP).

## 4) Local checks before deploying
```bash
# 1. Lint & type check
npm run lint -- --fix

# 2. Build
npm run build

# 3. Preview production
npm run preview
# Visit http://localhost:4173
```

## 5) Deploy
- Connect the `super-admin` directory as the Vercel project root or configure a monorepo project pointing to this folder.
- Push to your deployment branch; Vercel will build and deploy automatically.

## 6) Post-deploy verification
- Open `https://admin.airbotix.ai`
- Check:
  - UI loads without 404s; routes work on refresh and deep links
  - Login flow (magic link) completes and redirects to `/admin`
  - No dev logs in console, only errors
  - Supabase calls succeed under RLS

## Troubleshooting
- Blank screen or 404 on refresh: ensure `vercel.json` rewrites are present and base = '/'
- Assets 404: base must be `'/'` in `vite.config.ts`
- Wrong redirect domain: verify `VITE_APP_URL` in Vercel env
- Auth errors: verify Supabase Auth Site/Redirect URLs
