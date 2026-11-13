import { SITE } from "@/config/site";

/** Adds working days (Monday–Saturday; Sundays are skipped). */
export function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added++;
  }
  return d;
}

/** Usual delivery window counted from a given day. */
export function deliveryWindow(from: Date) {
  return { from: addBusinessDays(from, SITE.deliveryDays.min), to: addBusinessDays(from, SITE.deliveryDays.max) };
}
