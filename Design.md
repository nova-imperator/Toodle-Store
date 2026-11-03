# Toodle Store — Design

## 1. Direction: "the toy-brick box"

The identity comes from the owner's own logo: chunky **building-brick letters** in blue, orange, green, red and yellow around a rocket, plus the roll-up banner's cream border, red ribbons ("SPECIAL OFFER", "STARTING @ ₹49") and friendly hand-drawn kids.

The site should feel like opening a box of bricks: bright, solid primary colours on warm cream paper, chunky shapes you want to press, and illustrated children doing the thing each category is about. It is **multi-coloured on purpose**: the five brick colours *are* the brand. That is the explicit justification for using many colours, which `Rules.txt` §9 otherwise discourages.

What we deliberately avoid: purple/black themes, neon, glassmorphism, soft generic pastels, radial orbs, three-card SaaS rows, fake trust signals.

References reviewed: FirstCry (dense shop-by-age/category navigation, deal carousels, sticky mobile cart) and Hamleys India (character-led, playful headings, strong red). We borrow their **information architecture**, not their look.

## 2. Colour tokens (`src/styles/tokens.css`)

| Token | Hex | Use |
|-------|-----|-----|
| `--brick-red` | `#E8382D` | Primary action (Add to cart, Pay), offer ribbons, sale price |
| `--brick-blue` | `#1F7FE0` | Links, navigation, secondary buttons, focus ring |
| `--brick-yellow` | `#FFC72C` | Highlights, B2B button, badges, star of the logo |
| `--brick-green` | `#3FA34D` | Success, in-stock, free delivery |
| `--brick-orange` | `#FF8A1E` | Deals, countdowns, age chips |
| `--ink` | `#1D2B53` | Body text, headings (deep navy, never pure black) |
| `--ink-soft` | `#4F5B7A` | Secondary text |
| `--paper` | `#FFF8EA` | Page background (banner cream; never pure white) |
| `--card` | `#FFFDF8` | Cards and panels |
| `--line` | `#EADFC8` | Borders, dividers |
| `--tile-mint` → `--tile-sky` | `#C9F5DC` → `#9DC0FA` | Category illustration tiles (from the owner's artwork, only there) |

Each brick colour has a `-deep` variant (about 18% darker) used for the button "ledge" and hover.

**Category colour coding.** Every category is assigned one brick colour in `src/config/catalogue.ts`. Its tile ring, listing page header band and product card hover use it, so children and parents learn "red = cars" style wayfinding.

**Contrast.** Text on yellow and green uses `--ink`. White text only on red, blue and the deep variants (all ≥ 4.5:1).

## 3. Typography

- **Display: Baloo 2** (600–800). Round, chunky, friendly, and it supports Devanagari for later Hindi content. Used for H1–H3, prices and buttons.
- **Body: Nunito** (400–700). Rounded terminals that pair with Baloo and stay readable at small sizes.
- Scale (mobile → desktop): H1 32→48, H2 24→32, H3 19→22, body 16, small 14. Line height 1.5 for body, 1.1 for display.
- Both fonts are self-hosted at build time via `next/font`.

## 4. Shape language

- **Brick buttons.** Solid fill, 4px darker bottom "ledge" (`box-shadow: 0 4px 0 var(--x-deep)`), radius 12px. On press the button moves down 3px and the ledge shrinks, like pushing a brick. This is the only "shadow" style on the site.
- **Studs.** Small circles in brick colours, used as the section-heading marker (3 studs before every H2) and as the loading indicator (studs popping in sequence). No decorative dot grids.
- **Ribbons.** Price and offer labels use the banner's notched red ribbon shape (`clip-path`), e.g. "Starting @ ₹49", "-30%".
- **Orbit ring.** The dashed circle around the logo reappears around the hero character and the gift finder result.
- Corner radii: cards 16px, inputs 12px, chips fully round. No 32px "pill everything" look.
- Borders over shadows: cards use a 2px `--line` border; hover changes the border to the category colour.

## 5. Layout

- Mobile first, single column, 16px gutters. Breakpoints: 600px (2-col grids), 900px (desktop header, 3–4 col), 1200px (max content width 1240px).
- Product grid: 2 columns on phones (FirstCry style, so more toys are visible), 3 at 900px, 4 at 1200px.
- Carousels: native horizontal scroll with `scroll-snap`, arrow buttons at ≥ 900px, peek of the next card on mobile.
- Sticky mobile bottom bar on product pages: price + Add to cart. Sticky mini-cart button site-wide on mobile once the cart has items.

## 6. Components

| Component | Notes |
|-----------|-------|
| Header | Top strip (free delivery, WhatsApp number), main bar (logo, search, wishlist, account, cart with count), category bar. **Bulk / B2B** button in yellow with ink text. Mobile: hamburger drawer with category and age lists. |
| Category tile | Owner's illustration on mint→sky tile, colour-coded ring on hover/focus. |
| Age tile | Large age number in Baloo inside a brick-coloured block ("3–5 yrs"), small toy illustration. |
| Product card | Image on cream, brand, name (2 lines), price + struck MRP + red % ribbon, age chip, heart toggle, brick **Add** button that turns into a −/+ stepper once added. |
| Hero slider | Full-width illustrated slides, auto-advance 6 s, pauses on hover / focus / reduced motion, dot controls are studs. |
| Gift finder | Two steps (age → budget) as large chips, result shows matching toys inline. |
| Trust bar | Real facts only: Razorpay secure payment, free delivery across India, cash on delivery (confirmed by call), WhatsApp support. |
| Empty states | Delivery-mascot illustration with one clear action ("Your cart is empty, let's find a toy"). |
| Errors | Inline under fields, red text + icon, plain words ("Enter a 10-digit mobile number"). |

## 7. Motion

Motion is used where it tells the user something happened:
- Add to cart: the card's image thumbnail flies to the cart icon, the cart count bounces once.
- Hero: slide crossfade; the hero toys bob gently (4 s loop).
- Tiles and cards: lift 2px and change border colour on hover. No scaling, no tilting.
- Loading: stud loader, skeletons only for product grids that load on the client.
- Everything is disabled under `prefers-reduced-motion: reduce`.

## 8. Icons

Inline SVG icons drawn for the store (cart, heart, search, user, truck, shield, phone, WhatsApp), 2px stroke, rounded caps to match Baloo. Used only where they help recognition (header actions, trust bar), never as decoration next to every heading.

## 9. B2B look

Same tokens, more grown-up: ink-navy hero with yellow accents, fewer illustrations, more structure (numbered steps, FAQ, form). The kids illustrations appear only as the category thumbnails. No retail prices anywhere.

## 10. Imagery

- Owner assets: logo, banner, category tiles and delivery mascot (`public/images/brand`, `public/images/categories`).
- Generated locally by `scripts/generate-images.mjs`: product artwork per toy (flat, outlined illustration on cream in the category colour), hero slide art, age-group art and the missing "Fun Games" category tile in the same style as the owner's tiles.
- When real product photos arrive they replace generated artwork through the admin panel; the layout must not depend on illustration proportions (all product images are 1:1).
