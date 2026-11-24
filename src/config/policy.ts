// Return / exchange rules (owner, 24 Nov 2026): no money refunds; damaged, defective or wrong items are
// exchanged or replaced. The reporting window and proof below are sensible defaults – owner to confirm.

export const EXCHANGE_POLICY = {
  /** Time after delivery to report a problem. */
  reportWithinHours: 48,
  summary: "No refunds. Damaged, defective or wrong items are exchanged or replaced free of charge.",
};

/** Used in the privacy policy / terms (IT Rules 2021 expect a grievance contact). Owner may add a person's name. */
export const GRIEVANCE_CONTACT = { role: "Grievance Officer, Toodle Store", replyWithinDays: 15 };
