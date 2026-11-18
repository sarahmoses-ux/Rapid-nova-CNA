# API reference

All responses use `{data: ...}` or `{error: "..."}`. Cookie sessions are required for private endpoints. Obtain a token from `GET /api/auth/csrf`, preserve its session cookie, and send `X-CSRF-Token` on mutations. JSON bodies only. Validation errors: 400; no session: 401; permission/origin failure: 403; missing: 404; conflict: 409; service unavailable: 503.

Public: `GET /api/programs`, `/programs/:slug`, `/cohorts`, `/cohorts/:id`, `/announcements`, `/testimonials`, `/faqs`, `/settings/public`, `/health`. Only verified published offerings are listed. `POST /api/applications` accepts firstName, lastName, email, phone, location, program ID, optional cohort ID, schedule, education, optional experience, consent=true. `POST /api/contact`: name, email, message.

Auth: `POST /api/auth/login` (email,password,otp for staff), `/logout`, `/forgot-password` (email), `/reset-password` (token,password); `GET /api/auth/me`.

Student reads: `/api/student/profile`, `/enrollment`, `/schedule`, `/attendance`, `/materials`, `/assignments`, `/grades`, `/payments` (invoices), `/payment-history`, `/certificates`, `/clinical-training`, `/documents`, `/announcements`, `/practice-examinations`, `/examination-attempts`, `/overview`.

Student mutations: `POST /api/student/assignments/:id/submit` (text), `/examinations/:id/start`, `/examination-attempts/:id/submit` (answers array). Internal practice examinations are separate from official state examinations. Answers are withheld until server-side scoring.

Instructor reads: `/api/instructor/assigned-cohorts`, `/student-rosters`, `/class-schedule`, `/attendance`, `/learning-materials`, `/assignments`, `/examinations`, `/clinical-training`, `/overview`. All restrict to assigned cohorts.

Instructor mutations: `POST /api/instructor/attendance` (student,session,status,verifiedMinutes), `/assignments` (cohort,title,description,dueAt ISO,maxScore), `/clinical-training` (student,cohort,title,status). `PATCH /api/instructor/submissions/:id/grade` (grade,feedback). Attendance corrections are audited. No patient information fields.

Staff: `GET /api/admin/applications` supports status,page,limit. `PATCH /api/admin/applications/:id` accepts status and optional requirementsVerified. The Enrolled status can be set only via `POST /api/admin/enrollments` (applicationId,studentId,cohortId), which checks accepted/verified application, matching student identity, publication, capacity and deadline in a MongoDB transaction.

`POST /api/admin/programs` creates a draft with name,slug,description,duration,format,tuitionMinor,curriculum[],requirements[],requiredHours{classroom,lab,clinical}. `PATCH /programs/:id` edits and unpublishes; `POST /programs/:id/publish` requires approvalReference and verificationAcknowledged=true and administrator permission.

`POST /api/admin/cohorts` accepts program,instructor,startDate,endDate,enrollmentDeadline,schedule,location,capacity,published,status. `POST /class-schedules` accepts cohort,title,startsAt,endsAt,kind,location. Dates are ISO strings.

Finance: `POST /api/admin/invoices` (student,label,amountMinor); student `POST /api/payments/checkout` (invoiceId). Amounts are integer USD cents and determined on the server. `POST /api/payments/stripe/webhook` accepts raw signed Stripe events and is exempt from browser CSRF checks.

`POST /api/admin/certificates` (student,cohort,requirementsVerified=true) records academy completion only; completed enrollment and verified configured hours required. Does not create state credentials.

CSV: `GET /api/admin/students/template`, `/students/export` (JSON export payload); `POST /students/import/preview` (csv string); `POST /students/import` (records array with firstName,lastName,email,studentId,status). 500-row maximum. Import creates inaccessible random-password student accounts; authorized recovery is required. XLSX not implemented.

Other staff list endpoints: students,instructors,programs,cohorts,class-schedules,attendance,learning-materials,assignments,examinations,grades,clinical-training,tuition-payments,certificates,career-opportunities,announcements,contact-inquiries,content-management,users-and-roles,audit-logs,settings,reports. Limits are at most 100 per page. Access differs by role: admissions sees admissions/student management; finance sees invoices; content managers see public content; administrators see operational records. Unsupported mutations return 404.

`POST /api/admin/announcements` (title,body,published,audience); `POST /api/admin/notifications/deliver` sends queued Resend emails if configured. `POST /api/admin/users` provisions student accounts only; staff provisioning uses the local MFA command.
