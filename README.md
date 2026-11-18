# Rapid Novid CNA

Local development foundation for a healthcare training academy. No deployment has been performed. No academy approvals, prices, locations, testimonials, instructors, or class dates are fabricated. Public catalogue records start empty.

## Run locally

Requires Node 22.12+ (Node 24 supported) and a MongoDB replica set, including Atlas, for transactions.

1. Run `npm install` in the repository root.
2. Copy `.env.example` to `.env`; set a random `SESSION_SECRET` of at least 32 characters and `MONGODB_URI`.
3. Run `npm run dev:api` and `npm run dev` in separate terminals.
4. Open `http://127.0.0.1:5173`. Use the same hostname consistently in `FRONTEND_ORIGIN` and `PUBLIC_BASE_URL`. Set both to `http://127.0.0.1:5173` if using this URL.

The frontend remains navigable without MongoDB but shows service errors for database features. It never fakes saved submissions or account access.

## Accounts

There is no public account or admin registration. Set `INITIAL_USER_PASSWORD` privately in your shell (12+ characters), then run `npm run create-user -w backend`. The command prompts for identity and role; staff must enroll an authenticator and verify a code. Keep the displayed provisioning URI private. Clear the password variable afterward. MFA secret encryption at rest and managed staff recovery are production requirements.

## Implemented foundation

- Original responsive public website: home, about, programme catalogue, dynamic programme detail, CNA educational overview, admissions, schedules, tuition, resources, contact, draft legal pages, sign-in/reset.
- Five-step validated application; published-program restriction; MongoDB persistence; unique reference; notification outbox; staff application review.
- Seven roles; HTTP-only session cookies; MongoDB session store; CSRF/origin checks; rate limiting; password hashing; staff TOTP; scoped student/instructor access.
- Database-derived portal overview and record lists; staff application review/enrollment, program and cohort publication, record creation forms, student assignment submission and timed practice-test controls, student invoice checkout entry, and authorized CSV export.
- API workflows for program drafts and verified publication, cohort/session creation, transactional capacity-limited enrollment, invoice creation, assignment submission/grading, instructor attendance correction audits, clinical verification, timed internal practice tests, and completion-record issuance.
- Test-only Stripe hosted checkout; signature verification; unique webhook event/session indexes; transactional payment posting and refund reconciliation.
- Student CSV template, validation/duplicate preview, transactional import; email outbox delivery endpoint using Resend.
- Mongoose models for all requested entities. Extension schemas are clearly identified in source.

## Incomplete workflows and production gates

This is an initial implementation, not the complete production platform described in the brief. Several write workflows are API-only. Portal navigation exposes read views for implemented endpoints and clearly reports endpoints not implemented. It does not imply that every listed menu item is complete.

Remaining work includes comprehensive staff editing and deletion interfaces, instructor quiz-authoring/grading UI, full calendar month navigation, learning progress/modules, authorized document storage and signed downloads, XLSX support and import correction UI, completion PDF downloads, clinical placement/session management, installment-plan configuration, authorized refund initiation, reconciliation/receipts, email retry scheduling, SMS/calendar/maps integrations, CMS/FAQ/legal publication UI, multi-factor recovery, charts and comprehensive reports. Completion-record issuance is disabled unless `ENABLE_COMPLETION_RECORDS=true`; keep it disabled pending institutional review. Its API checks completed enrollment, configured verified hours, and explicit staff acknowledgment. Formal program-specific competency/checklist rules still need review.

No direct upload endpoint exists: sensitive documents cannot be uploaded through this version. Learning material models do not imply secure storage integration. No real patient records are supported.

External credentials are not configured. MongoDB workflows, Stripe events, email delivery and authenticated workflows require integration testing with real test services. The test suite covers validation/security boundaries, pure calculations, and public desktop/mobile UI behavior using controlled API responses; it does not establish external integration correctness.

## Verification

`npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e`, `npm run build`. Browser tests currently use the installed Microsoft Edge channel; change the channel in `playwright.config.ts` for another supported browser.

Never use production student data for development. Test transactional enrollment with simultaneous requests against a replica set; test role/object-level isolation with distinct accounts; verify webhook replay, asynchronous checkout, refunds, and duplicate delivery using Stripe CLI. Run keyboard, mobile, screen-reader, and browser checks before release. See `docs/IMPLEMENTATION.md` and `docs/API.md`.

## Payments and email

Only keys beginning `sk_test_` are accepted. Set `STRIPE_WEBHOOK_SECRET` and forward Stripe test events to `/api/payments/stripe/webhook`. Browser redirects never mark invoices paid. Refunds are reconciled from verified Stripe events; initiating refunds is not implemented. Do not enter live credentials. Public deployment or live payments require explicit owner authorization.

Set `RESEND_API_KEY`, verified `EMAIL_FROM`, and optionally `ADMISSIONS_EMAIL`. Queued emails are not necessarily delivered; an administrator invokes `/api/admin/notifications/deliver`. Application references contain no sensitive data. Configure scheduled processing, retries, monitoring, and approved templates before production.

## Deployment preparation

Frontend: build `npm run build -w frontend`; output `frontend/dist`. Configure an actual backend destination in `frontend/vercel.json` before deploying to Vercel. Keep API and frontend same-origin through a reverse proxy for cookie security. Backend: build `npm run build -w backend`, run `node backend/dist/server.js` with managed environment variables. Configure your host to route to the listening address, TLS termination, trusted proxy rules, and restricted network access. Atlas must use least-privilege credentials and backups. Review cross-origin session settings for your host.

Set `NODE_ENV=production`, HTTPS `FRONTEND_ORIGIN`/`PUBLIC_BASE_URL`, private secrets, encrypted backups and recovery tests. Configure log redaction, retention policy, monitoring, account recovery, secret rotation and document malware scanning. Never commit `.env`. Establish whether FERPA or other legal duties apply; safeguards alone do not establish compliance.

Verify Texas HHSC program authorization and current Nurse Aide Registry/exam requirements using official resources before publishing any training claims. No regulatory minimums are hardcoded here. Obtain institutional approval for curriculum, instructors, tuition, campuses, refund terms, and legal content. Replace illustrative stock photography with licensed academy assets where appropriate; photography does not represent actual academy students or staff.

Public SEO currently includes page titles, description, Open Graph basics and restrictive robots rules. Confirmed production origin/campuses are needed before generating canonical URLs, institutional structured data, and a production sitemap. Public prerendering and page-specific social metadata remain to be added.
