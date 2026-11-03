# Toodle Store — Development Rules

These apply on top of `Rules.txt` (the general AI development rules). Where they differ, this file is more specific and wins.

## 1. Working agreement
- The local folder is the single source of truth. Nothing is created in chat, artifacts or cloud documents.
- Read `PRD.md`, `Architecture.md`, `Design.md` and `Memory.md` before starting work. Update `Memory.md` at the end of every working session.
- Do not change behaviour outside the task. Do not add a dependency without noting why in `Memory.md`.

## 2. Code standards
- TypeScript strict mode. No `any` unless a third-party type forces it, with a comment.
- Server-only code lives in `src/server` and imports `server-only`. Client components are marked `"use client"` and kept small.
- Route handlers stay thin: parse with zod → call one service → return JSON. Business rules live in services.
- Database access only through `src/server/db.ts` and services. No Prisma calls in components or pages other than via services.
- Money is integers in paise everywhere. Format only at the edge with `lib/money.ts`.
- Names: components `PascalCase.tsx`, everything else `camelCase.ts`, CSS modules next to their component.
- No commented-out code, no `console.log` left behind (the dev mailer's console output is the only intended logging).

## 3. Approved dependencies
`next`, `react`, `react-dom`, `@prisma/client`, `prisma`, `zod`, `jose`, `nodemailer`, `sharp` (image script), `tsx` (seed script), `typescript` and types.
Anything else needs a reason recorded in `Memory.md`.

## 4. Security
- Secrets only in `.env` (git-ignored). `.env.example` lists names with empty or dummy values.
- Razorpay secret and webhook secret never reach the browser. Payment state changes only after signature verification.
- OTPs stored hashed, compared in constant time, rate limited.
- All input validated with zod on the server, even when validated in the browser.
- Admin routes check the role on every request (layout guard plus service-level check).
- Session cookies: `HttpOnly`, `SameSite=Lax`, `Secure` in production.
- B2B form: honeypot field and per-IP / per-phone rate limit.

## 5. Error handling
- Services throw `AppError(code, message, status)`. Route handlers turn it into `{ error: { code, message } }` with the status.
- Unknown errors return a generic 500 message; details go to the server log only.
- Every page that loads data has loading, empty and error states.

## 6. SEO rules
- One H1 per page. Titles under 60 characters using the patterns in the plan.
- B2C pages never use "wholesale", "bulk", "distributor" or "MOQ" in titles or H1. B2B pages never use "buy online", "shop now" or single-item prices.
- Search, cart, checkout, login, account and order pages are `noindex`.
- Filter query strings are canonicalised to the base listing URL.

## 7. Content honesty
- No invented reviews, ratings, sales counts, client logos or "trusted by" claims. Seed data carries no reviews; review UI shows its empty state until real reviews exist.
- Brand names in seed data are generic house brands until the owner supplies the real brand list.

## 8. Images
- Brand assets from `My Sample Images/` are copied (never edited in place) into `public/images/brand` and `public/images/categories` by the image script.
- Generated artwork is produced by `scripts/generate-images.mjs` and committed to `public/images`.
- Every image has meaningful alt text; decorative images use `alt=""`.
