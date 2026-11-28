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
- Shipping/minimum verified locally (15 checks, 13 Nov): ₹395 → ₹495 charged; ₹1,975 pays ₹100; ₹2,370 free; ₹30 cart refused. (COD was refused then; brought back 14 Nov, see below.)

## Free delivery threshold (24 Nov 2026)
- Free delivery now on item total (after coupon) of **₹999 or more** (`FREE_SHIPPING_FROM` in `src/config/shipping.ts`); ₹100 below that. All "₹2,000" copy updated.

## Owner requests (28 Nov 2026)
- SKU optional: empty → generated `TS-XXXXXX` (kept on re-save). Admin badges no longer show Deal / Available for B2B (saving leaves those DB flags unchanged); home 'Deals of the week' row hidden because Deal can't be managed.
- Uploaded photos are centred on a white 1600×1600 square; gallery, cards and admin thumbnails use object-fit: contain (no crop/zoom).
- Optional product video: `products.video_url` (YouTube link incl. Shorts, or https .mp4) → last gallery slide (youtube-nocookie embed). `src/lib/video.ts`.
- Age shown again: listing age filter, home 'Shop by age', footer column, phone menu (desktop menu bar still hidden).
- 'Sold out for now' label on product photos (cards + product page).
- Admin → B2B enquiries behind a PIN: env `B2B_PANEL_PIN` (owner's PIN, set in Vercel; never in repo). Unlock = signed cookie, 12 h; wrong tries rate-limited; export and edits also gated; 'Lock' link.
- `src/middleware.ts`: on production, any *.vercel.app host 308-redirects to NEXT_PUBLIC_SITE_URL.
- Phone inputs: `PhoneField` (digits only, strips +91/0, 10 digits, message on blur) on checkout and wholesale form.
- Legal fix: damaged/defective/wrong/missing items → replacement, exchange **or refund** within 48 h with unboxing photos/video; none for change of mind, wrong size ordered, damage after delivery (Consumer Protection Act 2019 / E-Commerce Rules 2020). Earlier 'no refunds' wording removed everywhere.

## Product photo upload (27 Nov 2026)
- Admin product form has an image picker (`components/admin/ImagePicker.tsx`): pick photos from computer/phone, thumbnails, set main, reorder, remove, or add by link. Browser shrinks big photos (>1.5 MB) to ≤1600 px before upload (Vercel ~4.5 MB request limit).
- `POST /api/admin/uploads` (admin with products access) re-encodes to webp ≤1600 px with sharp (strips EXIF/GPS) and stores bytes in `media_images` (Vercel has no persistent disk; no extra service needed). Served at `/media/<id>.webp` with 1-year immutable caching; works with next/image. `sharp` moved to dependencies.
- Photos removed from a product stay in `media_images` (small); could add a cleanup later.

## Analytics & follow-up (24 Nov 2026)
- Dashboard (`/admin?range=today|7d|30d|all`, IST days): orders, sales value, money received, average order, to ship, on the way, COD cash to collect, unpaid checkouts, visitors, page views, product views, conversion, new customers, enquiries, cancelled, most viewed, best sellers, day-by-day table. `services/admin/analytics.ts`.
- Visitors come from our own `page_views` table (`/api/track` + `VisitTracker` in store and b2b layouts): random `ts_vid` cookie id, path, product slug, external referrer host. No IP/name stored; bots and /admin ignored. Privacy policy mentions it.
- `/admin/checkouts`: unpaid checkouts (status pending_payment) with call/WhatsApp, hides people who ordered later. Only people who pressed Pay are captured (that's when the phone is saved).
- Order list tabs show counts.
- Free delivery wording is 'Free delivery on orders **above** ₹999' (₹999 itself still free).
- B2B alert recipients: `TEAM_ALERT_EMAILS` in Vercel (comma-separated). Owner asked to add wilfredgonsalves5@gmail.com – kept out of the public repo; owner adds it in Vercel.

## Launch (24 Nov 2026)
- Owner tested live payments and went live. `prisma/cleanup-before-launch.ts` (runs on deploy) deletes orders, customers, B2B enquiries, guest carts and OTPs created before 2026-11-24 20:30 IST, and resets coupon usage. Never touches newer data; can be removed after it has run in production. Test product disabled (`sync-test-product.ts` ENABLED=false deletes it).
- Admin sidebar badges = new since that admin last opened Orders / B2B enquiries / Customers (`admin_users.seen_*_at`, `services/admin/badges.ts`); refresh every minute via `/api/admin/badges`; tab title shows total.
- Free-delivery nudge: `FreeDeliveryProgress` (cart drawer, cart page, checkout) + line on phone cart bar.
- Policies rewritten in our own words (owner pointed to mimikotoys.com pages; not copied): **no refunds; damaged/defective/wrong items exchanged or replaced, report within 48 h with photos** (`src/config/policy.ts` – 48 h and unboxing video are my defaults, owner to confirm). Refund only when WE cancel (legal). Grievance contact = role + email (owner may add a name). Governing law: India (no city given).

## Live payment test products (24 Nov 2026)
- Products with SKU starting `TEST-` are hidden from listings/search/home/sitemap, noindex, and a cart with ONLY test products has no ₹50 minimum and no delivery charge (so a ₹2 real payment can be tested). Buy via direct link `/product/<slug>`. Owner adds/deletes the product in admin. Code can stay; delete the product (or set it to draft) after testing.

## Cash on delivery (14 Nov 2026)
- Owner brought COD back: **₹50 extra** (`COD_FEE` in `src/config/shipping.ts`). Owner chose: the ₹50 is **paid online via Razorpay at checkout** to confirm the order; the rest (items − coupon + delivery) is paid in cash.
- Order `total` includes the COD charge (`orders.cod_fee`, migration `featured_and_cod_fee`). Razorpay order amount = ₹50. After capture: status `placed`, `paymentStatus` stays `unpaid` (cash due); admin marking it **delivered** sets `paid`.
- Cancelling a placed/packed order (online or COD) returns stock. Refund button refunds the captured payment (for COD, just the ₹50 charge).
- Old `cod_enquiry` status (phone-confirmed COD, before 13 Nov) kept only for old orders.
- Verified locally: online asks full total, COD asks ₹50, unpaid COD order not confirmed, ₹50 verify → confirmed, order/track pages + email show cash due, delivered → paid, cancel → stock back.

## Site changes (14 Nov 2026)
- Contact: phone/WhatsApp **+91 99878 83903**, email **toodlestoreindia@gmail.com**, Facebook https://www.facebook.com/share/1LT8iDaL28/ (footer, contact page, email footer, JSON-LD sameAs).
- WhatsApp pre-filled messages differ: shoppers (`WHATSAPP_RETAIL_HREF`) vs bulk buyers on `/b2b` pages and wholesale emails (`WHATSAPP_BULK_HREF`), in `src/config/site.ts`.
- "Atreya Innovations Pvt Ltd" removed from footer, email footer and About page (and from everywhere else on 17 Nov).
- Hidden (commented out, easy to restore): header strip "We deliver only within India" (still on home + checkout), desktop menu bar (Shop by Category/Age, Offers, New arrivals, Best sellers), mobile menu age + quick links, listing age filter (`SHOW_AGE_FILTER`), footer "Shop by age", home "Shop by age" tiles. Age still shows on product cards/pages and in the gift finder.
- **Featured** products: `products.is_featured`; "Featured toys" carousel on home (after trust bar). Admin → Products list has on/off switches per product: On website (active↔draft), Featured, Best seller, New arrival, Deal; plus a Featured filter tab.

## Owner requests (17 Nov 2026)
- "Atreya Innovations Pvt Ltd" removed from **everywhere** on the site (terms, privacy, JSON-LD; `SITE.legalName` deleted). Don't add it back.
- Admin: `/admin/login`. Login = `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` set in Vercel env (created on first deploy; changing the env later does NOT change an existing admin's password). Admin pages: `noindex` meta + `X-Robots-Tag: noindex, nofollow, noarchive` header (next.config `headers()`, also `/api/*`). `/admin` deliberately not in robots.txt so Google can read the noindex.
- Login: Google button first ("Continue with Google"), email code below. Needs `GOOGLE_CLIENT_ID` (no NEXT_PUBLIC_ prefix: Vercel refused the public one; read on the server via `googleClientId()` and passed to the login page; old NEXT_PUBLIC_ name still works as fallback). Web OAuth client, JS origins: toodlestore.in, www, vercel.app, localhost:3000, localhost. No redirect URIs, no client secret. Google login saves name, email, photo (`users.avatar_url`, shown in header/menu) and pre-fills the checkout name.
- OTP spam: login code email is now plain (no images/links/emoji, subject "Your Toodle Store login code: 123456"). Real fix later: send from an own domain (e.g. no-reply@toodlestore.in via Brevo/Resend/SES) with SPF + DKIM + DMARC.
- B2B look: no cartoon art. Real product-photo banners from `scripts/build-b2b-images.mjs` (`public/images/b2b/{hero,cta}.webp`); owner's own photos go in `My Sample Images/b2b/hero.jpg` / `cta.jpg` and re-run. Category cards use real product photos (a different product per card, `getCategoryPhotoOptions`); categories without photos are listed as chips. Plain headings (`SectionHeading plain`), body font for headings, no stud edge on footer (`Footer plain`). B2B pages revalidate hourly.
- B2B enquiry form (24 Nov 2026) is **Phone (required) + Name (optional)** only, popup title 'Get our wholesale prices' (owner's reference: a competitor's 2-field popup). Name and city also nullable now (migration `enquiry_phone_only`). Earlier version (17 Nov) was name, mobile, city (owner: more fields scare buyers; team calls and asks the rest). Email/business type/state now nullable (migration `enquiry_short_form`); old enquiries keep theirs. No customer auto-reply unless an email is given; team alert still sent (subject ends 'please call', includes wa.me link). Don't add fields back without asking.
- B2B godown photos: owner generates them with an AI tool using `My Sample Images/b2b/AI-image-prompts.txt` (hero, cta, gallery-1..6). Run `node scripts/build-b2b-images.mjs` → resizes into `public/images/b2b/` and writes `src/config/b2b-gallery.json`; the 'Bulk stock, ready to ship' gallery (`StockGallery`) shows only when that list isn't empty. Owner declined downloading stock photos. Captions must not claim AI images are the owner's own godown.
- SEO: `pageSeo()` in `src/lib/seo.ts` gives every public page title, description, canonical, Open Graph + Twitter card. Share images `public/images/og/{store,b2b}.jpg` (1200×630). Optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. Site stays non-indexed until `NEXT_PUBLIC_ALLOW_INDEXING=true` (set it only on the real domain).

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
- OTP verify and Google login APIs return `{ name, isNew }` (`src/types/auth.ts`). After login the card shows a calm `WelcomeSplash` (green tick, "Welcome back, <first name>!" / "Welcome to Toodle Store!") for 1.2 s, then a full page load to `next`.
- **Owner strongly disliked big login motion** (full-screen overlay, confetti, word-by-word blur, bouncing mascot) — removed same day, along with BlurText and the `motion` package. Keep login/auth UI calm: a short fade at most.
- Fixed: the login code box overflowed phone screens (input's default width at big letter-spaced font) — inputs now `width: 100%`.

## Deployment
- GitHub: nova-imperator/Toodle-Store (public; plan PDF and `My Sample Images/` are git-ignored). Push with `gh auth switch --user nova-imperator`, then switch back to RRS-repositories.
- Vercel: https://toodle-store.vercel.app (Prisma Postgres). `scripts/build.mjs` finds the DB URL, waits for the DB, migrates, seeds an empty DB (structure only) + syncs banners/admin/coupon, removes sample products, syncs imported products, builds.

## Not done yet / next steps
- **TODO (owner, 14 Nov 2026): send B2B enquiry form submissions to a Google Sheet** — "we do later". Needs a Google account/Sheet from the owner (Apps Script web app or Sheets API service account).
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
- Home hero banner says "Toys for every age, delivered free" / "Free delivery across India", but delivery is ₹100 under ₹2,000 — reword?
