# Toodle Store — Project Memory

Read this first in every new session. Keep it current.

## How to run locally
1. Start **Docker Desktop**, then `docker compose up -d` (PostgreSQL 16 on port **5433**). If pages error with `PrismaClientInitializationError`, Docker is not running.
2. `npm install`
3. `.env` exists locally (git-ignored). On a new machine copy `.env.example` and fill `SESSION_SECRET`, `OTP_PEPPER`, `SEED_ADMIN_PASSWORD`.
4. `npx prisma migrate dev` then `npm run db:seed`
5. `npm run images` (regenerates everything in `public/images` plus `src/app/icon.png` / `apple-icon.png`)
6. `npm run dev` → http://localhost:3000 · admin at http://localhost:3000/admin

Checks: `npm run typecheck`, `npm run lint` (ESLint CLI), `npx next build`.

Dev conveniences:
- **Emails print in the server console** when `SMTP_HOST` is empty (OTP codes appear there).
- **Mock payments** when Razorpay keys are empty: a "Simulated payment" dialog lets you succeed/fail. Mock mode throws under `NODE_ENV=production`, so `next start` without keys cannot take online payments (by design).
- Coupon `TOODLE10` (10% off, min ₹499) is seeded.
- Admin login: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` (role: admin).
- `robots.txt` blocks everything unless `NEXT_PUBLIC_ALLOW_INDEXING="true"` (set only on live production).

## Key decisions
| Decision | Why |
|----------|-----|
| One Next.js 15 app (App Router), no separate API service | Plan only requires SSR + API; `src/server/services` keeps a later split possible |
| PostgreSQL via Docker on 5433 | Plan allows MySQL/PostgreSQL; 5433 avoids clashing with a local Postgres |
| CSS Modules + tokens, no Tailwind | Product-specific design system (Design.md) |
| Fonts self-hosted in `src/assets/fonts` (Baloo 2, Nunito, OFL) | Google Fonts download failed during dev; local is faster and offline-safe |
| Guest wishlist in cookie `ts_wish`; guest cart in DB keyed by cookie `ts_cart` | Wishlist table needs a user; both merge on login |
| Prices GST-inclusive; GST shown as "included" | Indian MRP convention |
| COD → order status `cod_enquiry`, stock untouched until admin "Confirm COD order" | Owner decision: COD is an enquiry until the team calls |
| Online orders: stock decremented only when payment captured (verify callback or webhook, idempotent) | No stock held for abandoned payments |
| Admin auth: separate `admin_users` + `ts_admin` cookie (1 day, SameSite strict); roles checked in every page and server action | Plan: role-based admin |
| Admin uses server actions; storefront uses `/api/*` route handlers | Admin forms are simple; storefront needs JSON for client interactions |
| No group-level `loading.tsx` in `(store)` | It made 404 pages return HTTP 200 (soft 404s) |
| Old WordPress URLs: `redirects` table, checked by `(store)/[...legacy]` and by product/category pages before 404 | Next's `permanentRedirect` sends **308** (Google treats it like 301). A trailing-slash URL takes 2 hops (slash strip, then mapping) |
| B2B honeypot field `website`: filled → fake success, nothing saved | Don't tell bots they were caught |
| Product images are generated illustrations (`scripts/images/*`) | No product photos yet; replace in admin (image paths field, 1:1 images) |
| Category tiles = owner artwork with labels cropped; names rendered as text; Fun Games tile generated | Real text for SEO/a11y |
| `"type": "module"` in package.json | Image script imports the shared `.ts` config directly (Node 24 type stripping) |

## Dependencies added beyond Rules.md list
- `eslint`, `eslint-config-next`, `@eslint/eslintrc` (linting)

## Progress
- [x] 1.1 Foundation
- [x] 1.2 Storefront (home, listings with filters/sort/pagination, product page)
- [x] 1.3 Cart & wishlist
- [x] 1.4 Login (email OTP, Google, sessions, merge)
- [x] 1.5 Checkout & orders (Razorpay + webhook + mock, COD enquiry, order pages, My orders, addresses)
- [x] 1.6 B2B (`/b2b`, 11 wholesale category pages, 6 segment pages, how it works, FAQ, enquiry popup + page, UTM capture, conversion event via dataLayer/fbq, team + auto-reply emails, honeypot, rate limits)
- [x] 1.7 Admin (dashboard, orders + COD confirm + status/tracking + refunds, products create/edit, customers, B2B enquiries with status/assign/notes/CSV export, coupons, redirects, settings status page)
- [x] 1.8 SEO basics (metadata, canonicals, JSON-LD Organization/WebSite/Product/Breadcrumb/FAQ/Service, `sitemap_index.xml` + `sitemap-b2c.xml` + `sitemap-b2b.xml`, robots, policy/about/contact pages, 404/error pages)

## Verified (3 Nov 2026)
- Typecheck, ESLint and `next build` pass.
- Shopper E2E (36 checks): guest cart/wishlist, OTP login + merge, coupons, checkout validation, mock payment fail/success, COD, order pages, all listing routes.
- B2B/admin/SEO E2E (40 checks): all B2B pages, enquiry validation + save + honeypot, sitemaps, robots, policy pages, every admin page, enquiry CSV export, COD listing, product editor; 404s return real 404; redirect reaches target.
- Screenshots reviewed: home (desktop + mobile), B2B landing, category, product (desktop + mobile).

## Not done yet / next steps
- Admin modules from the plan still missing: categories/age groups/brands editing, home banner editor, FAQ/policy editor, review moderation, bulk CSV product import, image **upload** (currently image paths).
- GST invoice PDF, WhatsApp alerts (needs a WhatsApp Business API provider), Shiprocket — phase 2.
- Category/age intro copy is ~40 words; plan wants 150–300 unique words per page.
- Legal pages (privacy, terms, returns, shipping) are drafts based on owner decisions — have them reviewed.
- Admin user management UI (add order manager / sales users) — currently via seed/DB only.

## Open questions for the owner
- Real brand list (current brands are placeholders).
- Age groups skip 24–36 months (0–24 m, then 3–5 y). Intended?
- Old WordPress sitemap, to fill the redirects table.
- Razorpay keys + webhook secret, SMTP credentials, team alert emails, WhatsApp alert number, Google OAuth client id, GA4/Meta pixel ids.
- Real product photos.
