# Repository Guidelines

This repository contains three related projects:
- Root website (React + Vite)
- Auth backend (Node/Express, TypeScript)
- Super Admin app (React + Vite + Supabase)

## Project Structure & Modules
- `src/` (root): marketing site UI, routes under `src/pages`, shared UI in `src/components`.
- `auth-backend/`: OTP/passwordless auth services (`src/services`, `src/repositories`, `src/adapters`).
- `super-admin/`: admin dashboard (`src/components`, `src/pages`, `src/lib`).
- `public/`, `docs/`, `rules/`: static assets and documentation.

## Build, Test, and Dev Commands
- Root site:
  - `npm run dev` — start Vite dev server.
  - `npm run build` — type-check then build to `dist/`.
  - `npm run preview` — serve production build locally.
  - `npm run lint` — ESLint checks.
- Auth backend (run inside `auth-backend/`):
  - `npm run dev` — nodemon dev server.
  - `npm run build` — compile to `dist/`.
  - `npm test` / `npm run test:coverage` — Jest tests.
  - `npm run start` — run compiled server.
- Super Admin (run inside `super-admin/`): typical Vite scripts (`dev`, `build`, `preview`).

## Coding Style & Naming
- TypeScript, 2-space indent, no semicolons, single quotes (`.prettierrc`).
- ESLint with TypeScript + React Hooks rules; fix with `npm run lint -- --fix`.
- Names: Components `PascalCase`, hooks `useCamelCase`, files match export (e.g., `WorkshopCard.tsx`).
- Avoid string literals in conditionals; centralize constants (see `rules.md`).

## Testing Guidelines
- Backend: Jest unit/integration tests for services, validators, and routes (use `supertest`).
- Frontend: Add tests where applicable; keep components small and testable.
- Place tests near source or in `__tests__` and name as `*.test.ts(x)`.

## Commit & PR Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Branch names: `feature/...`, `fix/...`, `docs/...`.
- PRs: clear description, testing steps, screenshots for UI, linked issues, checklist from `rules.md`.

## Agent-Specific Notes
- Follow file size and constant rules in `rules.md`.
- Keep changes scoped; do not modify unrelated modules.
- Update docs in `docs/` when adding features (architecture + env vars).

