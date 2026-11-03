# Toodle Store — Architecture

## 1. Stack

| Part | Choice | Why |
|------|--------|-----|
| App | **Next.js 15 (App Router) + TypeScript** | Server-rendered pages for SEO, route handlers for the API, one deployable. |
| Database | **PostgreSQL 16** via Docker Compose (local), **Prisma** ORM | Relational, typed queries, migrations. |
| Styling | **CSS Modules + CSS custom properties** (`src/styles/tokens.css`) | Product-specific design without a utility framework's defaults. |
| Validation | **zod** | One schema shared by forms and route handlers. |
| Sessions / Google token check | **jose** | Signed session cookie; verifies Google ID tokens against Google's JWKS. |
| Email | **nodemailer** (SMTP) | OTP, order and enquiry emails. In development without SMTP, mail is printed to the server console. |
| Payments | **Razorpay REST API** + Node `crypto` HMAC | No SDK needed; signature checks stay on the server. |
| Images | Files in `public/images`, optimised by `next/image`; artwork generated locally by `scripts/generate-images.mjs` (sharp) | No external image host needed for local development. |

No separate backend service in phase 1: route handlers are the controllers and `src/server/services` holds the business logic, so the API can later move to a standalone service without rewriting logic.

## 2. Request flow

```
Browser ──► Next.js page (server component) ──► service ──► Prisma ──► PostgreSQL
   │
   └─► client component ──fetch──► /api/* route handler ──► zod validation ──► service ──► Prisma
                                                │
Razorpay ──webhook──► /api/payments/razorpay/webhook (HMAC verified) ──► payment service
```

- Pages read data through services directly (no HTTP hop).
- Mutations from the browser go through `/api/*` route handlers, which validate input, call one service and map errors to HTTP responses.
- Admin forms use server actions that call the same services.

## 3. Folder structure

```
Toodle Store/
├─ PRD.md · Architecture.md · Rules.md · Phases.md · Design.md · Memory.md
├─ docker-compose.yml          PostgreSQL for local development
├─ .env.example                every environment variable, no secrets
├─ prisma/
│  ├─ schema.prisma            tables from the plan (users, products, orders, b2b_enquiries …)
│  └─ seed.ts                  categories, age groups, brands, demo products, admin user
├─ scripts/
│  └─ generate-images.mjs      builds brand / category / product / banner images locally
├─ public/images/              brand assets and generated artwork
└─ src/
   ├─ app/
   │  ├─ (store)/              B2C pages with the store header and footer
   │  ├─ b2b/                  B2B pages with their own header
   │  ├─ admin/                admin panel (role protected)
   │  ├─ api/                  route handlers (controllers)
   │  └─ sitemap-*.xml/        separate B2C and B2B sitemaps
   ├─ components/
   │  ├─ ui/                   buttons, inputs, price, rating … (no business logic)
   │  ├─ layout/               header, footer, mobile nav
   │  ├─ product/              product card, gallery, filters
   │  ├─ home/                 home page sections
   │  ├─ cart/ · checkout/     cart drawer, checkout steps
   │  └─ b2b/                  enquiry form, B2B sections
   ├─ server/
   │  ├─ db.ts                 Prisma client singleton
   │  ├─ auth/                 session cookie, OTP, Google, admin guard
   │  ├─ services/             catalogue, cart, wishlist, order, payment, enquiry, admin …
   │  ├─ integrations/         razorpay, mailer, pincode lookup
   │  └─ http.ts               route-handler helpers (JSON errors, rate limit)
   ├─ lib/                     pure helpers usable on client and server (money, format)
   ├─ hooks/                   client hooks (useCart, useCountdown …)
   ├─ types/                   shared types
   ├─ config/                  site config, navigation, catalogue constants
   └─ styles/                  tokens.css, globals.css
```

## 4. Data model

Implemented in `prisma/schema.prisma`, following the plan's table list:
`users, otp_codes, sessions, addresses, categories, age_groups, brands, products, product_categories, product_age_groups, product_images, carts, cart_items, wishlists, orders, order_items, payments, refunds, shipments, coupons, reviews, b2b_enquiries, redirects, admin_users, banners`.

Rules:
- Money is stored in **paise** as integers.
- `orders` keeps address snapshot, `order_items` keeps name and unit price snapshot.
- Cart belongs to `user_id` or an anonymous `session_id` (cookie). On login the guest cart merges into the user cart.

## 5. Auth

- **Customers:** email OTP (hashed with SHA-256 + server pepper, 10 min expiry, 5 attempts) or Google ID token. On success a row in `sessions` is created and its id is put in an HTTP-only, signed cookie valid 30 days.
- **Admins:** email + password (scrypt hash) in `admin_users`, separate cookie, role checked per admin module.

## 6. Payments

1. `POST /api/checkout` validates the cart and stock, creates an order (`pending_payment`) and a Razorpay order for the exact amount.
2. Browser opens Razorpay Checkout with the key id and Razorpay order id.
3. `POST /api/payments/razorpay/verify` checks `HMAC_SHA256(order_id|payment_id, key_secret)` and marks the order paid.
4. The webhook (`payment.captured`, `payment.failed`, `refund.processed`) is verified with the webhook secret and makes the same updates, so a closed browser does not lose the payment.
5. COD creates an order with status `cod_enquiry` and no payment.

Without Razorpay keys in `.env` the checkout runs in **mock mode** (development only) so the flow can be tested end to end.

## 7. Environments

- **Local:** `docker compose up -d` (PostgreSQL on port 5433), `npm run dev`.
- **Staging / production:** same app, managed PostgreSQL, SMTP and live Razorpay keys through environment variables; staging is `noindex` and password-protected.
