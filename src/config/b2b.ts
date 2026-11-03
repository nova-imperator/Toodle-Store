// B2B page content. Copy rules (Rules.md §6): no retail prices, no "buy online" / "shop now" wording.
import { CATEGORIES } from "./catalogue";

export const BUSINESS_TYPES = ["Toy shop", "Starting new business", "Online seller", "School", "Corporate gifting", "Other"] as const;

export const ORDER_VALUES = ["Under ₹50k", "₹50k – ₹2L", "₹2L – ₹5L", "Above ₹5L"] as const;

export const SEGMENTS = [
  {
    slug: "toy-shops",
    title: "Toy and gift shops",
    short: "Restock fast-moving toys across every age group with one supplier.",
    body: "Mix categories in a single order, from ₹49 pocket-money toys to premium RC cars, so your shelves always have something for every customer who walks in.",
  },
  {
    slug: "new-toy-store",
    title: "New store owners",
    short: "Opening a toy shop? We help you choose your first stock.",
    body: "Tell us your budget and location and we suggest a starter mix of best-selling categories, with no minimum order so you can test what sells before committing.",
  },
  {
    slug: "online-resellers",
    title: "Online resellers",
    short: "Wholesale toys for Instagram, WhatsApp and marketplace sellers.",
    body: "Order small quantities across many SKUs, get GST invoices for input credit, and have stock delivered anywhere in India.",
  },
  {
    slug: "schools-and-play-schools",
    title: "Schools and play schools",
    short: "Educational toys, puzzles and play-area kits in bulk.",
    body: "Counting frames, blocks, puzzles and musical instruments chosen by age group, invoiced to the school with GST.",
  },
  {
    slug: "corporate-gifting",
    title: "Corporates and events",
    short: "Family-day gifts, employee kids' hampers and event giveaways.",
    body: "Gift boxes packed by age, with your message card, delivered to one office or many.",
  },
  {
    slug: "return-gifts",
    title: "Return gifts in bulk",
    short: "Party return gifts for birthdays, schools and events.",
    body: "Goodie bags and small toys in quantities of 20 to 2,000, mixed colours and themes, packed and ready to hand out.",
  },
];

export const BENEFITS = [
  { title: "Wholesale pricing", text: "Trade prices on every category, shared in a price list after you enquire." },
  { title: "No minimum order", text: "Start small, mix categories, scale up when you see what sells." },
  { title: "11 categories, many brands", text: "Action figures to birthday gifts, all from one supplier." },
  { title: "Free delivery across India", text: "Your stock reaches you with no shipping charge." },
  { title: "GST invoice", text: "Proper tax invoices so registered businesses can claim input credit." },
  { title: "Real people on WhatsApp", text: "Talk to our team for quotes, samples and stock questions." },
];

export const STEPS = [
  { title: "Enquire", text: "Tell us what you need in a 1-minute form or on WhatsApp." },
  { title: "Get catalogue and quote", text: "We send the wholesale price list and a quote for your mix." },
  { title: "Confirm and pay", text: "Approve the quote and pay by bank transfer or UPI against a GST invoice." },
  { title: "Delivery", text: "We pack and ship to your shop, school or office anywhere in India." },
];

export const FAQS = [
  { q: "How do I see wholesale prices?", a: "Send an enquiry and our team shares the current wholesale price list and a quote for the products you're interested in, usually within 24 hours." },
  { q: "Is there a minimum order quantity?", a: "No. There is no minimum order quantity or value, and you can mix categories in one order." },
  { q: "How long does delivery take?", a: "Most bulk orders are dispatched within 2–4 working days of payment and delivered across India, with delivery free of charge." },
  { q: "Do you provide a GST invoice?", a: "Yes. Every business order comes with a GST invoice. Share your GST number in the enquiry form so we can bill your business." },
  { q: "Can I get samples first?", a: "Yes, ask for samples in your enquiry and we'll suggest the best way to try a few products before a larger order." },
  { q: "Can I return unsold stock?", a: "No. Like our retail store, we don't accept returns, so we're happy to help you choose a mix that sells before you order." },
];

export const WHOLESALE_CATEGORIES = CATEGORIES.map((c) => ({ ...c, wholesaleSlug: `${c.slug}-wholesale` }));
