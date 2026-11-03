# Toodle Store — Product Requirements

Source: *Toodle Store — New Website Plan (B2C + B2B)*, Atreya Innovations Pvt Ltd, 1 Nov 2026.
Brand assets: `My Sample Images/` (logo, roll-up banner, category illustrations, delivery mascot).

## 1. What we are building

One website on **toodlestore.in** replacing the current WordPress store. It serves two audiences:

| Side | Lives at | Goal |
|------|----------|------|
| **B2C** — parents, relatives, gift buyers | `/` | Fast, simple toy purchase in as few steps as possible, paid through the existing Razorpay account. |
| **B2B** — toy shops, new store owners, resellers, schools, corporates, return-gift buyers | `/b2b` | Turn visitors into saved bulk-purchase enquiries the sales team follows up. |

Brand line: **"Every Child Deserves One!"** Toys start at **₹49**. Delivery across India, free on every order.

## 2. Users

- **Parent / gift buyer (primary, mobile-first).** Shops by category, age or budget, wants quick checkout with UPI.
- **Business buyer.** Researching suppliers, wants wholesale pricing, no minimum order, GST invoice. Will not buy online in phase 1.
- **Store team.** Admin, Order manager, Sales / B2B roles managing catalogue, orders, COD enquiries and B2B leads.

## 3. Catalogue

**11 categories:** Action Figures, Fun Games, Cars & Vehicles, Dolls & Dollhouses, Educational Toys, Kids Puzzles, Musical Toys, Remote Control Toys, Soft Toys, Toy Guns & Blasters, Birthday Gifts.

**5 age groups:** 0–24 months, 3–5 years, 5–7 years, 7–10 years, 11+ years.

Products belong to many categories and many age groups, and one brand.

## 4. Functional requirements

### 4.1 B2C storefront
- Header: Shop by Category, Shop by Age, Brands, Offers, highlighted **Bulk / B2B** button, Search, Wishlist, Cart, Login.
- Home: hero slider (2–3 B2C offers + 1 B2B slide), category tiles, age tiles, Best sellers / New arrivals / Deals carousels with Add to Cart on the card, brands strip, gift finder (age + budget: under ₹499 / ₹999 / ₹1,999), B2B strip, trust bar, customer reviews, footer.
- Listing pages: `/shop`, `/category/{slug}`, `/age/{slug}`, `/brand/{slug}`, `/search?q=` with price / age / brand filters and sorting (filter URLs canonicalised to the base page).
- Product page: gallery, price and MRP, age, brand, material, safety info, dimensions, description, FAQs, reviews, Add to Cart, wishlist.
- Guest cart and wishlist; merged into the account on login.

### 4.2 Login (one screen, no passwords)
- Email OTP: 6 digits, valid 10 minutes, resend after 30 s, max 5 attempts. First login creates the account.
- Continue with Google (One Tap on mobile). Accounts matched by email.
- Session lasts 30 days.

### 4.3 Cart and checkout
- Cart: change quantity, remove, coupon, price summary. Delivery always free. Stock re-checked on entering checkout.
- Single-page checkout: contact (email + mobile), address (pincode auto-fills city/state, saved for next time), delivery estimate by pincode, order summary (items, coupon, free delivery, GST, total), payment.
- **Razorpay**: server creates the Razorpay order, browser opens Checkout, server verifies the signature. Webhooks (captured, failed, refund processed) update the order. Secret key never leaves the server.
- **COD**: shown as an option but saved as a *COD enquiry* (not a confirmed order). Shopper sees "Thank you, we'll get back to you shortly".
- Failed payment returns to the payment step with cart and address intact.
- After order: thank-you page, confirmation email, My Orders with status Placed → Packed → Shipped (tracking link) → Delivered.
- **No returns or refunds.** Admin may issue manual Razorpay refunds for exceptions.

### 4.4 B2B (`/b2b`)
- Landing: hero with Start Now, who we supply, why Toodle Store, wholesale categories, how it works (Enquire → Catalogue & quote → Confirm & pay → Delivery), FAQ, repeat CTA + WhatsApp.
- Enquiry form (popup and `/b2b/enquiry`): full name*, mobile* (10 digits), email*, business name, business type*, city & state*, GST number (format checked), categories (multi-select), estimated order value, message.
- On submit: save with status **New**, source page and UTM; thank-you message ("Our team will call you within 24 hours"); team email/WhatsApp alert and auto-reply; honeypot + rate limit by phone/IP; conversion event.
- No retail prices on B2B pages. No minimum order quantity or value.

### 4.5 Admin panel (`/admin`)
Role-based (Admin, Order manager, Sales). Modules: dashboard, products, categories / age groups / brands, orders and COD enquiries, customers, coupons, B2B enquiries (status pipeline New → Contacted → Quote sent → Won / Lost, assign, notes, export), content (banners, FAQ, policies), reviews, settings.

### 4.6 Common pages
About, Contact, Shipping policy, Return policy, Privacy policy, Terms.

## 5. Non-functional requirements
- **Server-rendered** pages so search engines see full content.
- **Mobile first**; fast on mid-range Android over 4G.
- Prices stored in **paise** (integers). Orders keep name / price / address snapshots.
- SEO separation: B2C never uses "wholesale / bulk / distributor / MOQ" in titles or H1; B2B never uses retail phrasing. Separate sitemaps `sitemap-b2c.xml`, `sitemap-b2b.xml`.
- Accessible: keyboard navigable, visible focus, alt text, respects `prefers-reduced-motion`.
- No invented testimonials, ratings, statistics or client logos. Reviews shown only when real.

## 6. Owner decisions (fixed)
| Topic | Decision |
|-------|----------|
| Cash on delivery | Saved as a COD enquiry, team confirms by phone |
| Shipping | Free on every order |
| Returns / refunds | None |
| B2B minimum order | None |
| B2B alerts | Email + WhatsApp; recipients provided by owner |

## 7. Contact details (from banner)
Phone / WhatsApp: +91 91379 17819 · Instagram: @toodlestore_india

## 8. Out of scope for phase 1
Coupons UI polish, reviews moderation flow, gift guides blog, Merchant Center feed, WhatsApp order updates, courier integration, B2B self-serve accounts. See `Phases.md`.
