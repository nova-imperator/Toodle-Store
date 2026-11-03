const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const inrExact = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });

/** Formats paise as rupees, dropping paise when they are zero. */
export function formatPaise(paise: number): string {
  return paise % 100 === 0 ? inr.format(paise / 100) : inrExact.format(paise / 100);
}

export function discountPercent(mrp: number, price: number): number {
  return mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
}

/** GST included in a GST-inclusive price, rounded to the nearest paisa. */
export function includedGst(grossPaise: number, ratePercent: number): number {
  return Math.round(grossPaise - grossPaise / (1 + ratePercent / 100));
}
