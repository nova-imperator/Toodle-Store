# Toodle-Store

Toy store website for **toodlestore.in**: a retail shop for parents (B2C) and a wholesale enquiry site for businesses at `/b2b`.

Built with Next.js 15, PostgreSQL (Prisma) and Razorpay. Project documents: [PRD](PRD.md) · [Architecture](Architecture.md) · [Rules](Rules.md) · [Phases](Phases.md) · [Design](Design.md) · [Memory](Memory.md) (current state and open questions).

## Run locally

Needs Node 20+ and Docker Desktop.

```bash
docker compose up -d          # PostgreSQL on port 5433
npm install
cp .env.example .env          # fill SESSION_SECRET, OTP_PEPPER, SEED_ADMIN_PASSWORD
npx prisma migrate dev
npm run db:seed               # categories, ages, banners, coupon TOODLE10, admin user
npx tsx prisma/sync-imported.ts   # products from prisma/data/imported-products.json
npm run dev                   # http://localhost:3000  (admin: /admin)
```

Without SMTP settings, emails (including login codes) are printed in the terminal. Without Razorpay keys, checkout shows a simulated payment box.

## Deploy a preview on Vercel

1. **Import** this GitHub repo in Vercel (framework: Next.js; defaults are fine).
2. **Database:** in the Vercel project open *Storage → Create Database* (Prisma Postgres or Neon) and connect it to the project for all environments.
3. **Environment variables** (*Settings → Environment Variables*):

   | Name | Value |
   |------|-------|
   | `SESSION_SECRET` | random 64-character string |
   | `OTP_PEPPER` | another random 64-character string |
   | `DEMO_MODE` | `true` for the approval preview only |
   | `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | first admin login (created on deploy if missing) |

   Optional now, required before launch: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `TEAM_ALERT_EMAILS`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_SITE_URL`.
   Generate random strings with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
4. **Deploy.** Each build (`scripts/build.mjs`) migrates the database, sets up categories and banners on an empty database, creates the admin login, and adds any new imported products. Products edited in the admin panel are never overwritten.

## Adding real products from the old site

```bash
npm run import:products -- https://toodlestore.in/product/<slug>/ [more links]
```

This copies the name, prices, category, ages, badges, description and photos into `prisma/data/imported-products.json` and `public/images/products/wp/`, and updates the local database. Commit and push; the next deploy adds them to the live site.

The preview is not indexed by Google (`robots.txt` blocks everything unless `NEXT_PUBLIC_ALLOW_INDEXING=true`).

## Going live on toodlestore.in

- Add the domain in Vercel → *Settings → Domains*, set `NEXT_PUBLIC_SITE_URL=https://toodlestore.in`.
- Remove `DEMO_MODE`, add real Razorpay and SMTP settings, and set `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- In Razorpay add the webhook `https://toodlestore.in/api/payments/razorpay/webhook` (payment.captured, payment.failed, refund.processed).
- Load old WordPress URLs into Admin → Redirects before switching DNS.

## Useful scripts

| Command | What it does |
|---------|--------------|
| `npm run images` | Rebuilds hero, age and category artwork (needs the owner's `My Sample Images` folder, which is not in git) |
| `npm run typecheck` / `npm run lint` | Type and lint checks |
| `npm run db:reset` | Wipes and re-seeds the local database |
