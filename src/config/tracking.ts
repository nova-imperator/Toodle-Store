import { SITE } from "./site";

/** Answers describe only what the store actually does. */
export const TRACKING_FAQS = [
  {
    q: "Where do I find my order number?",
    a: "It's in your order confirmation email (the subject reads \"Order TS… confirmed\") and in My orders when you're logged in. It starts with TS followed by 10 digits.",
  },
  {
    q: "How will I know when my order ships?",
    a: "We email you when your order is packed, when it ships (with the courier name and tracking link) and when it's delivered. You can also check this page any time.",
  },
  {
    q: "How long does delivery take?",
    a: `Most orders arrive ${SITE.deliveryDays.min}–${SITE.deliveryDays.max} working days after payment. Remote areas can take a little longer.`,
  },
  {
    q: "Can I see exactly where my parcel is?",
    a: "Once your order ships, use the Track parcel button to open the courier's own tracking page with the latest scan.",
  },
  {
    q: "It says \"Payment not completed\". What now?",
    a: "The payment didn't go through, so the order isn't confirmed yet. Your cart is saved and you can pay again from checkout. If money left your account, WhatsApp us with your order number and we'll check it with Razorpay.",
  },
  {
    q: "Can I cancel or change my order?",
    a: "WhatsApp us as soon as possible with your order number. We'll do our best to help if it hasn't shipped yet.",
  },
];
