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
| No cash on delivery; all orders paid online (13 Nov 2026) | Owner decision. `cod_enquiry` status and admin "Confirm COD order" remain only for orders placed before the change |
| GST shown as "–" in cart, checkout, order page, admin and emails; no "prices include GST / inclusive of all taxes" claims | Owner (13 Nov 2026): prices don't include GST. `gst` is still computed and stored per order for future invoicing; confirm GST treatment with the owner/accountant before live launch |
| Delivery ₹100, free when item total after coupon ≥ ₹2,000; minimum order ₹50 | Owner decision 13 Nov 2026. Rules live in `src/config/shipping.ts`; cart service computes them, checkout re-checks |
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
- `motion` (v12) — needed by the React Bits `BlurText` component (owner asked for React Bits motion, 13 Nov 2026)

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

## Real products from the old site (13 Nov 2026)
- Owner sends specific product links from toodlestore.in (only those, not the whole catalogue).
- `npm run import:products -- <url> [<url>…]` reads the WooCommerce Store API by slug, saves data to `prisma/data/imported-products.json`, photos (square, white background, webp) to `public/images/products/wp/`, and updates the local DB.
- Every deploy runs `prisma/sync-imported.ts`: creates missing imported products only, never overwrites admin edits.
- Mapping: Woo categories → our 11 categories; age tags ("3+ years" → 3–5 and 5–7, etc.) → our age groups; "Best Seller"/"New Arrival" tags → badges; on sale → deal. Stock starts at 25 (Woo doesn't expose counts). SKU `TS-WP-<id>` when empty.
- Imported products get **no safety text** (don't invent safety claims for real products).
- Imported so far (8): LCD Writing Tablet, Educational Laptop Toy, Radish Rabbit Toy Phone, Dancing & Talking Cactus, Strike Gun With 6 Bullet, Fighter Jet Toys, Nail Polish Organic Makeup Set, Princess House Set.
- Sample (generated) products and placeholder brands were removed on owner's request (13 Nov). `prisma/remove-sample-products.ts` runs on every deploy (SKU pattern `TS-XX-000`); the seed no longer creates products or brands.
- "Brands" nav link removed and brand sections hidden until real brands exist.
- Hero banners are synced from `prisma/seed.ts` on every deploy (no banner editor yet). Copy avoids claims not backed by real products (no "from ₹49", no "message card").
- Source data quirks to raise with owner: dollhouse sets are in "Fun Games" on the old site; "Strike Gun With 6 Bullet" description says 10 bullets.

## Payments (13 Nov 2026)
- Razorpay **test** keys from `Payments/prompts and credentials` (git-ignored folder; repo is public) are in local `.env`. Live keys come later.
- Integration already existed (order create in `/api/checkout`, modal in `components/checkout/razorpay.ts`, HMAC verify in `/api/payments/razorpay/verify`, webhook). Owner's prompt asked to not duplicate, so no `razorpay` npm SDK and no extra `/api/create-order` route.
- Verified locally: real test-mode order created, bad signature → 400 and order stays unpaid, valid signature → order placed, cart cleared.
- Vercel needs `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` (owner adds in dashboard). Webhook secret not set yet (optional in test).
- Test card 4100 2800 0000 1007, CVV 123, expiry 12/26 · test UPI `test@razorpay`.
- Razorpay test checkout works on https://toodle-store.vercel.app (owner tested). Old deployment URLs (`toodle-store-<hash>-…vercel.app`) keep their old settings; always test on the main URL.
- Shipping/minimum/COD-removal verified locally (15 checks): ₹395 → ₹495 charged; ₹1,975 pays ₹100; ₹2,370 free; ₹30 cart refused; COD request refused.

## Order tracking (13 Nov 2026)
- `/track-order`: guests look up an order with order number (`TS` + 10 digits) + order email; no login. Header "Track order" link (truck icon on phones), mobile menu, footer. Emails link to `/track-order?order=…` (order number pre-filled).
- API `POST /api/orders/track`: both fields must match; rate limited 10/10 min per IP; returns progress, items, totals, first name, city/state/pincode, courier/AWB/tracking URL — never street address or phone.
- New order columns `placed_at, packed_at, shipped_at, delivered_at, cancelled_at` (migration `order_journey_dates`), set on payment capture and by admin status changes. Older orders show steps as "Done" without a time.
- Layout follows owner's reference screenshots but without time slots, wallet rewards or invented stats.

## Email (13 Nov 2026)
- Sending via Gmail SMTP as toodlestoreindia@gmail.com (app password in local `.env`; owner adds the same SMTP_* vars in Vercel and removes DEMO_MODE). Gmail free limit ≈ 500 emails/day; move to Brevo/SES with an @toodlestore.in sender later.
- Branded templates in `src/server/emails/` (layout + templates): login code (single-colour blue digit tiles — owner found multi-colour "over exaggerated"), order confirmed, status updates (placed/packed/shipped/delivered/cancelled, with courier + Track parcel), wholesale enquiry auto-reply. Team B2B alert stays plain text.
- Email images load from the live site (`/images/brand/logo-wide.png`, `mascot-delivery.png`); locally they fall back to toodle-store.vercel.app (`EMAIL_ASSET_URL` overrides).

## Login welcome & motion (13 Nov 2026)
- OTP verify and Google login APIs return `{ name, isNew }` (`src/types/auth.ts`). `LoginForm` shows `WelcomeSplash` ("Welcome back, <first name>!" / "Welcome to Toodle Store!", mascot hop, confetti, progress bar) for ~2.4 s, then a full page load to `next`. Reduced motion: no confetti, 0.9 s.
- React Bits components are vendored into `src/components/motion/` with their licence header (MIT + Commons Clause: fine to use in the site, don't redistribute as a component library). A user-level Claude skill `react-bits` explains how to add more.
- Fixed: the login code box overflowed phone screens (input's default width at big letter-spaced font) — inputs now `width: 100%`.

## Deployment
- GitHub: nova-imperator/Toodle-Store (public; plan PDF and `My Sample Images/` are git-ignored). Push with `gh auth switch --user nova-imperator`, then switch back to RRS-repositories.
- Vercel: https://toodle-store.vercel.app (Prisma Postgres). `scripts/build.mjs` finds the DB URL, waits for the DB, migrates, seeds an empty DB (structure only) + syncs banners/admin/coupon, removes sample products, syncs imported products, builds.

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
