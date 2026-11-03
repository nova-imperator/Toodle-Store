# Toodle Store — Development Phases

Business phases come from the website plan. Each is broken into build steps that can be finished and checked one at a time.

## Phase 1 — Launch

| Step | Scope | Done when |
|------|-------|-----------|
| 1.1 Foundation | Next.js app, tokens and global styles, Docker PostgreSQL, Prisma schema, seed, image script | `npm run dev` serves the home page with seeded data |
| 1.2 Storefront | Header, footer, home sections, shop / category / age / brand / search listings with filters, product page | All B2C browse URLs render server-side with real data |
| 1.3 Cart & wishlist | Guest cart via cookie, cart drawer and page, wishlist, sticky mobile cart button | Add / update / remove works without login |
| 1.4 Login | Email OTP, Google sign-in, sessions, cart and wishlist merge | A new email can sign in and the guest cart survives |
| 1.5 Checkout & orders | Single-page checkout, pincode lookup, Razorpay (mock in dev), COD enquiry, webhooks, thank-you, My Orders, order emails | Paid and COD flows complete end to end in test mode |
| 1.6 B2B | `/b2b` landing, wholesale category and segment pages, how it works, FAQ, enquiry popup + page, alerts | An enquiry is saved with UTM and the team mail is sent |
| 1.7 Admin | Login, dashboard, products, taxonomy, orders + COD enquiries, customers, B2B enquiries with export, settings | Team can run daily operations without touching the database |
| 1.8 SEO & launch prep | Metadata, structured data, separate sitemaps, robots, redirects table + middleware, policy pages | Lighthouse SEO ≥ 95 on home, category and product pages |

## Phase 2 — Growth
Coupons, reviews and moderation, gift finder refinements, blog and B2B guides, Merchant Center feed, WhatsApp order updates, Shiprocket integration, GST invoice PDF.

## Phase 3 — B2B self-serve
Approved business accounts, wholesale prices after login, quantity tiers, online bulk orders.
