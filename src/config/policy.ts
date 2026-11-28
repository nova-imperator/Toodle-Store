// Return / exchange / refund rules. Updated 28 Nov 2026 after the owner checked Indian consumer law
// (Consumer Protection Act 2019 + E-Commerce Rules 2020): damaged, defective, wrong or missing items must get a
// remedy (replacement / exchange / refund). Change of mind, wrong size ordered, or damage after delivery: none.

export const EXCHANGE_POLICY = {
  /** Time after delivery to report a problem. */
  reportWithinHours: 48,
  summary:
    "Damaged, defective, wrong or missing items are replaced, exchanged or refunded if reported within 48 hours of delivery with unboxing photos or video. No refund or exchange for change of mind, a wrong size or age ordered, or damage after delivery.",
};

/** Used in the privacy policy / terms (IT Rules 2021 expect a grievance contact). Owner may add a person's name. */
export const GRIEVANCE_CONTACT = { role: "Grievance Officer, Toodle Store", replyWithinDays: 15 };
