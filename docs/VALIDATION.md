# Validation record

November 18, 2026, local Windows workspace.

- Frontend and backend TypeScript checks passed.
- ESLint passed.
- Vitest/Supertest: 12 tests passed for CSRF/origin checks, authentication requirements, validation, lack of public admin registration, unconfigured payment failure, attendance calculations, practice scoring, token comparisons, and CSV escaping.
- Playwright: 10 tests passed across desktop and mobile viewports in installed Microsoft Edge. Coverage: home layout and horizontal overflow, unpublished-program empty state, application validation and unavailable-program guard, keyboard FAQ interaction, draft policy label, student sign-in boundary.
- Frontend Vite and backend TypeScript production builds passed. The Vite build splits React, form validation, and animation libraries into separate chunks. Dependency annotation warnings from Zod are non-blocking.

The browser run exposed a text-encoding issue introduced by Windows PowerShell's default decoding. It was corrected to UTF-8 without BOM; policy labels and punctuation now render correctly. An ambiguous test heading selector was narrowed to the page heading. Stock photos were downloaded as local assets for reliable loading.

Windows sandbox restrictions prevented esbuild from resolving the Vite configuration; approved unrestricted build/browser commands passed. This was an execution restriction, not a source compilation error.

## Motion update

Added viewport-triggered staggered reveals, hero entrance transitions, interactive card/button feedback, sticky navigation, reading progress, FAQ/menu transitions, and a back-to-top control. Reduced-motion preferences disable decorative motion, including dynamically changing that preference during a session. All 12 desktop/mobile Playwright checks passed after the update, including sticky header, back-to-top behavior, and reduced-motion checks. ESLint and production builds passed.

## Unverified integrations and remaining checks

Signature motion follow-up: custom SVG heartbeat drawing, a scroll-linked curved enrollment path (horizontal on desktop, vertical on mobile), pointer-tracked card lighting, and program-card corner choreography were added. All 14 desktop/mobile browser checks passed, including signature interaction and live reduced-motion preference changes. Frontend production build and ESLint passed.

No MongoDB server, replica-set transaction test, authenticated real-account browser test, Stripe test webhook/replay/refund test, email delivery test, private document-storage test, restore test, full WCAG audit, or load test was available. These remain required before production. No public deployment was made. No live payments were enabled.

## Phase status

Foundation and public pages implemented and validated as above. Admissions, API, portals, scheduling, finance, clinical tracking and notifications have working source implementations with integration verification pending. Some requested capabilities remain scaffolds or unimplemented, as listed in README. This document does not mark all twelve roadmap phases complete.
