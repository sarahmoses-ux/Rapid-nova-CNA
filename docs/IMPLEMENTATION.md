# Implementation plan and institutional review register

1. Foundation: Vite/React/TypeScript, Express/TypeScript, MongoDB, shared visual language.
2. Public experience: responsive landing page, admissions, program catalogue, schedules, resources, contact, draft policies.
3. Admissions: validated five-step application, database persistence, unique reference, staff review.
4. API: cookie sessions, CSRF, scoped roles, validation, audit records, pagination.
5. Administration: database-derived overview, applications, program publication, cohorts, records.
6. Student/instructor portals: authenticated records and assigned cohort access.
7. Education: schedules, attendance, assignments, practice tests.
8. Finance: test-only Stripe checkout, signature-verified webhook, idempotency, invoices.
9. Clinical/completion: instructor verification and completion document gating.
10. Operations: email outbox, CSV import/export and audit trail.
11. Validation: type checks, lint, unit/API tests, production builds.
12. Handoff: configuration, deployment instructions, remaining production gates.

## Missing academy information

No program authorization, campus, instructors, prices, dates, phone, organization history, testimonials, clinical partnerships, policies, or regulatory status was provided. Keep program records unpublished until staff verifies those facts. Do not seed invented students, payments, reviews, or enrollment metrics. Public program and class lists must reflect published database records only. The CNA overview is an educational planning page, not an offer of an authorized course.

## Reference review

Reviewed Red Cross (training taxonomy), Dallas College (clear admissions/schedules/student paths), and Indeed Career Guide (topic-based career navigation) on November 18, 2026. CNA Online was inaccessible and Nurse.com returned 403. Original layout and copy; no affiliation implied.

## Delivery tracking

See README for verified features and remaining work. A scaffold or data model alone is not a finished workflow. No public deployment or live payment activation is authorized.
