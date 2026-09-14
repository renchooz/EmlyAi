# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Before starting any UI/product work, read `TASKS.md` (living backlog) and `PROGRESS.md` (session log) at the repo root.** They track a multi-phase premium UI/UX transformation in progress — check what's already done and what's next before assuming scope.

## Project

EmlyAI (repo name `ai-resume-sender`) — an AI-powered job application automation platform. Users upload resumes (PDF), the app matches them against a job description using Gemini AI, generates a personalized application email/cover letter, and sends it through the user's own Gmail account via Gmail API + OAuth.

Monorepo with two independent Node projects, no shared root `package.json`/workspace tooling:
- `server/` — Node.js + Express 5 (ESM, `"type": "module"`) API
- `client/` — React 19 + Vite + Tailwind CSS 4 SPA

## Commands

Backend (run from `server/`):
```bash
npm run dev     # nodemon src/server.js — hot reload dev server
npm start       # node src/server.js — production start
```
There are no backend tests configured (`npm test` is a placeholder that exits 1). `server/testGemini.js` and `server/testModels.js` are ad-hoc manual scripts for probing the Gemini API/model list, not an automated test suite — run with `node testGemini.js` if needed.

Frontend (run from `client/`):
```bash
npm run dev       # vite dev server
npm run build     # vite build
npm run lint      # eslint .
npm run preview   # preview production build
```
There is no frontend test suite either.

Full stack via Docker (from repo root):
```bash
docker compose up --build   # builds server, client, and a mongo:7 container
docker compose down
```
`docker-compose.yml` at the root is for local Docker use; the production compose file is generated fresh on every deploy by the GitHub Actions workflow (see below) — it is not a checked-in file on the server.

## Environment variables

Backend `server/.env`: `PORT`, `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `CLIENT_URL`, `SERVER_URL`.

Frontend `client/.env`: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID` (baked in at build time as Vite build args — changing them requires a rebuild, not just a redeploy).

## Architecture

### Backend (`server/src`)

Layering is strict: `routes` → `controllers` → `services`/`models`. Routes only wire an Express path to `protect` middleware and a controller; all business logic and error handling (try/catch returning `{ success, message }` JSON) lives in controllers; all external API calls (Gemini, Gmail) live in services.

- `app.js` — Express app setup: CORS locked to `CLIENT_URL` with `credentials: true`, `/uploads` served statically (twice, once absolute via `path.join(process.cwd(), "uploads")` and once relative — both are registered, keep both if editing this), JSON + cookie-parser, then route mounting, plus `/api/health` and `/`. `server.js` is the entrypoint: loads `.env` via `config/env.js`, connects Mongo, then `app.listen`.
- Auth (`auth.routes.js` / `auth.controller.js`): JWT-based, issued as an **httpOnly cookie** named `token` (not a bearer header) — `middleware/auth.middleware.js#protect` reads `req.cookies.token`, verifies it, and loads the user onto `req.user`. Supports both local email/password (bcrypt) and Google OAuth login (`/api/auth/google`), both converging on the same JWT-cookie session.
- Resumes (`resume.routes.js` / `resume.controller.js`): PDF upload via `multer` (`config/multer.js`, disk storage under `uploads/`, 5MB limit, PDF mimetype only), text extracted with `pdf-parse` and stored on the `Resume` document (`extractedText`) so AI calls never need to re-read the file from disk.
- AI (`ai.routes.js` / `ai.controller.js` / `services/ai.service.js`): all Gemini calls go through `services/ai.service.js`, which lazily creates a single cached `gemini-2.5-flash` model instance. Four operations: `analyzeResumeWithJD`, `generateJobEmail`, `generateCoverLetter`, `selectBestResume`. Every prompt instructs Gemini to "return ONLY valid JSON"; responses are parsed by stripping markdown fences and/or regex-extracting the first `{...}` block (`text.match(/\{[\s\S]*\}/)`) before `JSON.parse` — when adding a new AI operation, follow this same extraction pattern rather than trusting raw JSON output.
- Gmail (`gmail.routes.js` / `gmail.controller.js` / `services/gmailOAuth.service.js` / `services/email.service.js`): separate OAuth2 flow from login — a user logs in first, then separately "connects Gmail" (`/api/gmail/auth` → Google consent → `/api/gmail/callback`, no `protect` on the callback since Google redirects here without cookies) which stores `accessToken`/`refreshToken`/`expiryDate` per-user in the `GmailToken` model. Sending mail (`email.service.js#sendGmailWithAttachment`) hand-builds a raw RFC 2822 multipart MIME message (HTML body + base64 PDF attachment) and posts it via `gmail.users.messages.send` — there is no template library involved, so edits to the email format happen in `makeBody`/`formatEmailHtml` in that file.
- One-Click Apply (`apply.routes.js` / `apply.controller.js`) is the orchestrator that composes the above: fetch all of the user's resumes → `selectBestResume` → `generateJobEmail` → `sendGmailWithAttachment` → write an `EmailLog` record (status `sent`/`failed`). `previewApplication` runs the same selection/generation steps without sending, for the UI's preview step.
- Data models (`models/`): `User`, `Resume` (owns `extractedText`), `GmailToken` (1:1 with `User`), `EmailLog` (append-only send history), `Analysis` (saved resume/JD analysis results).

### Frontend (`client/src`)

- `AppRoutes.jsx` defines all routing; everything under `/dashboard`, `/resumes`, `/analyze`, `/cover-letter`, `/one-click-apply`, `/email-history`, `/settings` is nested inside a single `ProtectedRoute` guard wrapping `DashboardLayout`. `/`, `/login`, `/register` are public.
- State is split into one React Context per domain (`context/AuthContext.jsx`, `ResumeContext.jsx`, `AIContext.jsx`, `GmailContext.jsx`, `EmailHistoryContext.jsx`) rather than a single global store. Each context wraps its matching `api/*.js` module (e.g. `AuthContext` wraps `api/authApi.js`) and is the only place that calls that API module — pages consume contexts via hooks, not the API modules directly.
- `api/axios.js` is the single shared axios instance: `baseURL` from `VITE_API_URL`, `withCredentials: true` (required for the httpOnly JWT cookie to be sent), and a response interceptor that normalizes every error to `{ message, status }`. All other `api/*.js` files import this instance rather than configuring axios themselves.
- `AuthContext` calls `/api/auth/me` once on mount (`fetchMe`) to hydrate the session from the cookie; `authLoading` gates `ProtectedRoute` until that resolves.
- UI: Tailwind CSS 4 (via `@tailwindcss/vite`, no separate `tailwind.config.js`) plus small local `components/ui/*` primitives (button, card, badge, input) built with `class-variance-authority`/`tailwind-merge`/`clsx` — follow this pattern for new primitives rather than pulling in a component library. `components/landing/*` are marketing/landing-page-only sections, separate from the authenticated dashboard components.

## Deployment

CI/CD is GitHub Actions, triggered on push, split into two reusable workflows:
1. `.github/workflows/push.yml` — builds server and client Docker images, scans each with Trivy (`severity: CRITICAL`, fails the build on findings) *before* pushing to Docker Hub, then pushes both `latest` and a `${{ github.sha }}` tag.
2. `.github/workflows/deploy-ec2.yml` — SSHes into the EC2 host and regenerates `.env`, `docker-compose.yml`, and the Nginx site config from scratch on every deploy (nothing here is committed server-side state), pulls the new images tagged with the deploy commit SHA, brings the stack up, health-checks `http://127.0.0.1:5000/api/health`, and automatically rolls back to the previously-running image tags if the health check fails.

When changing infra (ports, env vars, Nginx routing), the source of truth is this workflow file, not the root `docker-compose.yml` (which is dev-only).

Full runbook for provisioning a *new* EC2 instance (security group ports, GitHub secrets to set, Google OAuth redirect URIs to register, Certbot HTTPS setup) is documented in `Readme.md` under "New EC2 setup" — consult it before changing deployment-related secrets or OAuth config.
