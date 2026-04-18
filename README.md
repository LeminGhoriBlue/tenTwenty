# Ticktock

Weekly timesheet UI: sign in, list weeks with filters and pagination, open a week to review or edit entries, and track progress toward 40 hours (including overtime). Uses the Next.js App Router and internal `/api` routes with client-side persistence in `localStorage`.

**Dashboard actions:** Each row links to `/dashboard/[weekId]`. The label reflects week status — **Create** (Missing), **Update** (Incomplete/Overtime), **View** (Completed). The detail page supports add/edit/delete for all statuses in this demo.

**Live site (Vercel):** [Dashboard](https://ten-twenty-j092qs617-leminghoriblues-projects.vercel.app/dashboard) — the app root redirects to `/dashboard`, so you can also use the [project home](https://ten-twenty-j092qs617-leminghoriblues-projects.vercel.app/).

---

## Setup instructions

**Prerequisites**

- Node.js **18+**
- **npm**

**Install dependencies**

```bash
npm install
```

**Run locally**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). `/` redirects to `/dashboard`.

**Other scripts**

| Command | Purpose |
| --- | --- |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (watch mode) |
| `npm run test:run` | Vitest single run (CI-friendly) |

**Demo account** (defined in `data/mockUsers.ts`):

| Field | Value |
| --- | --- |
| Email | `admin@ticktock.com` |
| Password | `admin@123` |

**Environment**

No `.env` is required for the default demo: Auth.js is wired in `lib/auth.ts` with an in‑process secret so the app runs after `npm install`.

For production, replace the hardcoded secret with `AUTH_SECRET` / `NEXTAUTH_SECRET` (and set `AUTH_URL` or `NEXTAUTH_URL` as needed) instead of committing secrets.

---

## Frameworks and libraries

| Package | Role |
| --- | --- |
| **Next.js** (`next` 16.x) | App Router, SSR/RSC, API routes |
| **React** / **React DOM** (19.x) | UI |
| **TypeScript** (5.x) | Types |
| **Tailwind CSS** (v4) + **@tailwindcss/postcss** | Styling |
| **Auth.js** (`next-auth` v5 beta) | Credential login, JWT sessions |
| **Axios** | HTTP client (`lib/http.ts`, base `/api`) |
| **Lucide React** | Icons |
| **Radix UI**, **class-variance-authority**, **clsx**, **tailwind-merge**, **tw-animate-css** | Primitive components and styling helpers (shadcn-style stack) |
| **shadcn** (CLI tooling) | Component scaffolding |
| **ESLint** + **eslint-config-next** | Linting |
| **Vitest**, **@vitejs/plugin-react**, **jsdom** | Unit / component tests |
| **Testing Library** (React, jest-dom, user-event) | DOM queries and interactions in tests |

**Tests**

- **Unit:** `lib/utils.test.ts` (`cn`, `formatDate`, `formatWeekDateRange`, `getDateRangeBounds`), `lib/timesheetSort.test.ts` (column sorting + action labels), `lib/timesheetEntryFormValidation.test.ts` (modal field rules).
- **Components:** `ValidatedFormField`, `TimesheetStatusBadge`, `TimesheetTableEmptyRow`, `RetryErrorAlert` under `components/**/*.test.tsx`.

Pure helpers used by the dashboard live in `lib/timesheetSort.ts`; entry-modal validation lives in `lib/timesheetEntryFormValidation.ts` so logic stays easy to test without mounting pages.

---

## Assumptions and notes

- **Persistence:** Timesheets and entries are persisted in browser `localStorage` (key: `ticktock.timesheets.db`) and treated as the client-side DB. On first load, when local data is missing, the app hydrates from mock API data and then writes it to local storage.
- **Auth:** Credentials are validated against `data/mockUsers.ts`. The demo secret in `lib/auth.ts` is not suitable for production.
- **API surface:** The client only calls Next.js route handlers under `app/api/**`; there is no direct browser access to the mock store module.
- **Week status:** Derived from total logged hours for the week — **0** → Missing, **1–39** → Incomplete, **40** → Completed, **41+** → Overtime.
- **Overtime:** When a week exceeds 40 hours, status becomes **Overtime** and the weekly detail header shows the extra amount as `+X hrs overtime`.
- **Date range filter:** Preset ranges compare each week’s start/end to the selected window.
- **Sessions:** JWT-based sessions via Auth.js; sign-in and sign-out use full-page navigation after success or logout.

**Main routes**

- `/login` — sign in  
- `/dashboard` — week list (columns: Week #, date range, status, action that routes to the week)  
- `/dashboard/[weekId]` — entries grouped by day with add/edit/delete and overtime indicator when total hours exceed 40  

**Performance (frontend)**

- **Memoized work:** Filter/sort/pagination on the dashboard and derived values on the weekly view (`useMemo`) so lists are not recomputed on unrelated state updates.
- **Stable handlers:** Navigation and modal actions use `useCallback` where it keeps child work predictable and satisfies effect dependency lists.
- **Code splitting:** The timesheet entry modal is loaded with `next/dynamic` (no SSR) and only mounted when opened, so its JavaScript is fetched on demand instead of with the initial weekly page bundle.
- **Pure UI:** `TimesheetStatusBadge` is wrapped in `React.memo` to avoid re-rendering unchanged rows during table updates.
- **Fonts:** `next/font` (Inter) with `display: swap` reduces layout-blocking text rendering.

---

## Time spent

Update the figures below so they reflect your actual effort.

| Area | Approx. time |
| --- | ---: |
| Project setup and authentication | 2 h |
| Dashboard list (table, filters, pagination) | 2 h |
| Weekly detail page and entry modal | 2 h |
| Error handling, loading states, and polish | 1 h |
| Fixes, linting, and deployment | 1 h |
| **Total** | **~8 h** |
