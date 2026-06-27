# E2E Test Catalog

This catalog is the acceptance checklist for Playwright E2E coverage. Update it
before or alongside feature work, then use the implemented spec files to lock in
the verified behavior.

## Workflow

Use the local feature flow:

```txt
Spec -> Code -> Verify -> Test -> Green
```

1. Spec: add or update the relevant journey in this catalog.
2. Code: implement the feature.
3. Verify: run the app and walk the real UI in a browser.
4. Test: add or update the matching Playwright spec.
5. Green: run the related spec locally; run full E2E before releases or large
   refactors.

E2E tests are intentionally local-first. CI should continue to prefer fast
checks such as `pnpm lint` and `pnpm build` unless a separate E2E environment is
explicitly provisioned.

## Test Harness

- Config: `playwright.config.ts`
- Specs: `tests/e2e/specs/`
- Fixtures: `tests/e2e/fixtures/`
- Test-only API: `src/app/api/e2e/users/route.ts`

The test-only API is disabled unless Next.js is running locally in development
with `E2E_TEST_SECRET=mksaas-e2e-secret` and the request includes the configured
`x-e2e-secret` header. Test accounts must use the `e2e-*@example.test` email
pattern so cleanup stays scoped.

## 1. Public Page Smoke Test

**File:** `specs/public-pages.spec.ts` | **Priority:** P0

Verifies that public pages render in English/Chinese and dark/light mode without
browser console errors or page errors.

| # | Test name | Flow |
|---|---|---|
| 1 | Public pages render successfully | Open `/`, `/pricing`, `/blog`, `/blog/what-is-fumadocs`, `/ai`, `/about`, `/contact`, `/changelog`, `/roadmap`, `/waitlist`, `/cookie`, `/privacy`, `/terms`, `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password` for `en` and `zh`, in `dark` and `light` mode. Verify each returns 2xx, renders a visible body, applies the requested theme, and emits no browser errors. |
| 2 | Home login modal opens | Open `/`, click the navbar login button, verify the login dialog and credential inputs are visible, and assert no browser errors. |
| 3 | Health check responds with pong | Call `/api/ping` and verify `{ "message": "pong" }`. |

## 2. Authentication And Protected Routes

**File:** `specs/auth.spec.ts` | **Priority:** P0

Verifies login and route protection with real Better Auth endpoints and seeded
verified users.

| # | Test name | Flow |
|---|---|---|
| 1 | Guests are redirected from dashboard | Open `/dashboard` while signed out, expect redirect to `/auth/login`, and verify the email input is visible. |
| 2 | Verified user can sign in | Create an E2E user, mark it verified, sign in through `/auth/login`, and verify dashboard content. |
| 3 | User can register from UI | Fill `/auth/register`, verify the registration success message, mark the test account verified, sign in through `/auth/login`, and verify dashboard content. |
| 4 | Signed-in user can view demo users dashboard | Sign in as a user, open `/admin/users`, and verify the demo users page renders. |

## 3. Protected Page Smoke Test

**File:** `specs/protected-pages.spec.ts` | **Priority:** P0

Verifies authenticated app pages render in English/Chinese and dark/light mode
without browser console errors or page errors.

| # | Test name | Flow |
|---|---|---|
| 1 | Protected pages render successfully | Sign in as an admin E2E user, then open `/dashboard`, `/admin/users`, `/settings/profile`, `/settings/security`, `/settings/apikeys`, `/settings/billing`, `/settings/credits`, `/settings/notifications`, `/payment` for `en` and `zh`, in `dark` and `light` mode. Verify each returns 2xx, renders a visible body, applies the requested theme, and emits no browser errors. |

## 4. Profile Settings

**File:** `specs/settings-profile.spec.ts` | **Priority:** P1

Verifies the signed-in profile update flow.

| # | Test name | Flow |
|---|---|---|
| 1 | User can update display name | Sign in, open `/settings/profile`, change the name, save, verify success toast, and reload to verify persistence. |

## Deferred Coverage

These flows should be added after their dependencies are made deterministic:

| Area | Reason |
|---|---|
| Payment checkout and portal | Requires Stripe or Creem test fixtures, webhook simulation, and provider-specific env. |
| Storage uploads | Requires deterministic local storage assertions and small fixture files. |
| Transactional email | Requires a fake mail provider or captured verification links. |
| AI tools | Requires provider mocks or stable fake responses to avoid cost and flake. |
| Docs smoke | Current `/docs` page emits a React hydration mismatch in the browser console; add it after that baseline issue is fixed. |
