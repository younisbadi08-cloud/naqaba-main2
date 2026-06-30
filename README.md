# نقابة المختبرات والمعدات الطبية — Yemen Medical Labs & Equipment Syndicate Portal

> Production-ready, full-stack official website + management system for a Medical Syndicate / Medical Association, with Arabic-first RTL UI, doctor membership flow, complaints, CMS, admin dashboard, RBAC, and audit logging.

📄 **للملخص العربي الكامل** للمشروع وقرارات البناء، راجع [docs/SUMMARY.md](docs/SUMMARY.md).

---

## ✨ Features

### Public website
- **Home** — hero, services, latest news, announcements, upcoming events, statistics, membership CTA.
- **About / Council / Membership / Events / Articles / Downloads / Contact / Complaints / Privacy / Terms**.
- **Members directory** with multi-filter search (name, specialty, city, membership number) and public profile pages.
- **News & announcements** with categories, search, filters, featured news, detail pages.
- **Complaints / inquiries** with tracking-number generation and a public tracking page.
- **404, error, unauthorized** professional pages.
- **SEO** — `metadata`, OpenGraph, `sitemap.xml`, `robots.txt`.
- **RTL Arabic-first** layout with Cairo + Tajawal fonts, light/dark theme.

### Member portal (`/portal`)
- Dashboard with status, profile completion %, action items.
- Edit profile (Arabic + English, specialty, license, city, bio…).
- Upload required documents (photo, ID, degree, license, specialty).
- Submit / renew membership application.
- Membership status timeline.
- Subscriptions, payments history (payment driver pluggable).
- Notifications & complaints history.
- Settings: change password.

### Admin dashboard (`/admin`)
- Overview (stats, recent members, complaints, content).
- Doctors / members — search, filter, status changes (Submitted → Under review → Approved / Rejected / Suspended / Expired / Renewal pending), assign membership number, toggle directory visibility, view documents & status history.
- Membership applications queue.
- News, Announcements, Articles, Events — full CRUD with publish/unpublish, cover image upload, categories.
- Downloads center — upload PDFs, organize by category.
- Categories management.
- Complaints management — change status, reply (public + internal notes), see full timeline.
- Council members management.
- **Users & RBAC** — SuperAdmin can create staff, change roles, deactivate.
- **Audit log** of sensitive actions.
- Site settings (contact info, social links, map embed).

### Roles
`SUPER_ADMIN` · `ADMIN` · `CONTENT_MANAGER` · `MEMBERSHIP_OFFICER` · `SUPPORT_OFFICER` · `DOCTOR`

### Security
- bcryptjs password hashing (cost 12)
- Auth.js (NextAuth v5) JWT sessions
- Middleware route protection + server-side RBAC checks
- Zod input validation on all server actions
- File upload validation (size + mime-type allowlist)
- Audit logging for sensitive operations
- `.env`-based secrets — `.env.example` committed, real `.env` ignored

---

## 🧱 Tech Stack

- **Next.js 14** App Router + Server Actions + RSC
- **TypeScript** strict mode
- **Tailwind CSS** + custom shadcn-style component library (Radix UI primitives)
- **Prisma ORM** — SQLite for dev (zero-config), switch to PostgreSQL for production
- **Auth.js (NextAuth v5)** — credentials provider
- **bcryptjs**, **Zod**, **react-hook-form**, **date-fns**, **lucide-react**, **next-themes**
- **Docker** + `docker-compose` (Next.js app + Postgres)

---

## 🚀 Quick start (local, no Docker)

Prereqs: Node.js 20+, npm.

```bash
# 1) Install dependencies
npm install

# 2) Copy env (SQLite by default — no DB setup needed)
cp .env.example .env
# (optionally edit .env to change defaults)

# 3) Create database schema + seed sample data
npx prisma db push
npm run db:seed

# 4) Start dev server
npm run dev
```

Open <http://localhost:3000>.

### Default credentials (dev only — change in production!)
| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@syndicate.local` | `Admin@12345` |
| Membership Officer | `officer@syndicate.local` | `Officer@12345` |
| Sample Member| `doctor@syndicate.local` | `Doctor@12345` |

---

## 🐳 Run with Docker (PostgreSQL)

```bash
cp .env.example .env
# generate a real secret:
export AUTH_SECRET=$(openssl rand -base64 32)

docker compose up --build
```

After the stack is up:

```bash
# Seed the database (only first time)
docker compose exec app npx tsx prisma/seed.ts
```

---

## 🏭 Production build

```bash
npm run build
npm run start
```

For PostgreSQL in production, switch the Prisma datasource provider:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then:

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public" \
  npx prisma migrate deploy
```

---

## 📦 npm scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production (runs `prisma generate` first) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Apply schema to dev DB (SQLite default) |
| `npm run db:migrate` | Create/apply migrations |
| `npm run db:seed` | Seed dev data |
| `npm run db:reset` | Reset database (destructive) |

---

## 🔐 Environment variables

See `.env.example` for the full list. Key ones:

| Var | Notes |
|---|---|
| `DATABASE_URL` | `file:./dev.db` (SQLite) or `postgresql://…` |
| `AUTH_SECRET` | `openssl rand -base64 32` — **required in prod** |
| `AUTH_URL`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` | Full origin URL |
| `UPLOAD_DRIVER` | `local` (default) — S3 abstraction prepared for future |
| `MAX_UPLOAD_MB` | Upload size cap (default 10MB) |
| `PAYMENT_DRIVER` | `none` (default) — pluggable architecture for future payment integration |

---

## 🧪 Code quality

```bash
npm run typecheck
npm run lint
```

---

## 🩺 Troubleshooting installation

If `npm install` is slow or fails with `ECONNRESET` / `EAI_AGAIN`, your environment
may be hitting IPv6 connectivity issues against the npm CDN. Try:

```bash
NODE_OPTIONS="--dns-result-order=ipv4first" npm install --no-audit --no-fund
# or use pnpm (faster mirror selection):
NODE_OPTIONS="--dns-result-order=ipv4first" pnpm install --registry=https://registry.npmmirror.com
```

After install, the verification chain is:

```bash
npx prisma generate     # types for Prisma client
npm run typecheck       # TS strict check, no emit
npm run lint            # next/eslint
npx prisma db push      # create dev SQLite DB
npm run db:seed         # populate sample data
npm run dev             # launch on :3000
```

---

## 🚧 Known limitations / Next steps for real deployment

- **Payments**: payment driver is `none`. Implement adapter under `src/server/payments/` and wire env vars for the chosen gateway (Stripe / Paymob / Fawry / Mada …).
- **Email**: SMTP env vars are placeholders. Add an email sender (e.g. Nodemailer) to send membership-status emails — falls back to console logging.
- **File storage**: local disk by default. For production behind multiple replicas, implement the S3 driver in `src/server/uploads.ts`.
- **Rate limiting**: add an edge middleware (Upstash Ratelimit / Vercel) on `/api/auth/*`, `/api/upload`, `/complaints` form, etc.
- **CSRF**: Auth.js handles auth-form CSRF; for public server-action forms, ensure same-origin + proper headers (Next.js does this by default for SA).
- **Image optimization**: replace `<img>` with `next/image` for CDN-served images once a CDN is configured.
- **2FA**: column added to `User`; UI not wired.
- **i18n**: structurally prepared (English fields on entities, `lang="ar"` baseline); add a routing layer for `/en` if needed.
- **Backups**: schedule `pg_dump` for Postgres in production.

---

## 📁 Project structure

```
src/
├── app/
│   ├── (public)/         ← public website routes
│   ├── (auth)/           ← login, register, logout
│   ├── (portal)/portal/  ← doctor portal
│   ├── (admin)/admin/    ← admin dashboard
│   ├── api/              ← REST endpoints (auth, upload)
│   ├── error.tsx         ← global error boundary
│   ├── not-found.tsx     ← 404
│   ├── unauthorized/     ← 403 page
│   ├── robots.ts
│   ├── sitemap.ts
│   └── layout.tsx        ← root (RTL, theme, providers)
├── auth.ts / auth.config.ts / middleware.ts
├── components/
│   ├── ui/               ← shadcn-style primitives
│   ├── site/             ← header, footer, logo
│   ├── dashboard/        ← shell, sidebar, page header, uploader
│   └── theme-*.tsx, session-provider.tsx
├── server/               ← rbac, audit, uploads, auth-service
├── lib/                  ← db, utils, constants
└── hooks/                ← use-toast
prisma/
├── schema.prisma         ← full data model
└── seed.ts               ← deterministic sample data
```

---

## 🤝 License

This codebase is an internal/official portal scaffold. Add your organization's license header before publishing.
