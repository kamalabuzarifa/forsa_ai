# EduMatch Admin Platform TODO

## Current audit

- [x] Existing admin authentication middleware identified (`admin` middleware).
- [x] Universities, countries, opportunities, applications, and users have admin APIs.
- [x] Student catalogue pages consume database-backed universities and opportunities.
- [~] Add roles, permissions, pivot tables, seeding, centralized permission middleware, admin role API, and Roles & Permissions page. Core admin routes now use module permissions; user assignment UI and remaining non-admin route policies remain.
- [~] Add generic admin CRUD for fields, degrees, skills, languages, opportunity types, and funding types with safe delete errors. Activation/status and country/location consolidation remain.
- [~] Expose opportunity tuition, currency, and study mode to admin forms, API resources, and Program Details. University/media fields remain.
- [ ] Add structured CMS pages and sections with draft/publish/ordering controls.
- [ ] Add validated media management and reference-safe deletion.
- [ ] Add FAQ and general content management.
- [ ] Add admin announcements and notification templates.
- [ ] Make AI Advisor settings and matching weights configurable.
- [ ] Make eligibility rule vocabulary and global settings configurable.
- [ ] Replace hardcoded comparison data with a persisted/API-backed workflow.
- [~] Add append-only audit logs, protected listing API, admin UI, and role/user access logging. Opportunity, application, CMS, media, notification, and AI events remain.
- [~] Add authorization, ownership, publishing, and regression tests. RBAC denial/allowance and role audit integration are covered; broader resource tests remain.

## Implementation order

1. Complete catalogue fields and publication behavior.
2. Introduce roles, permissions, and centralized backend authorization.
3. Add lookup taxonomy CRUD.
4. Add CMS pages, sections, FAQs, and media.
5. Add notifications and platform settings.
6. Add configurable advisor, matching, and eligibility rules.
7. Replace comparison fixtures and add audit logging.
8. Run migration, API authorization, frontend, and end-to-end regression tests.
