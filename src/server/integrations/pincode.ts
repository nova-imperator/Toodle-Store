import "server-only";
import { SITE } from "@/config/site";

export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  serviceable: boolean;
  estimate: { from: string; to: string };
}

const cache = new Map<string, { city: string; state: string } | null>();

/** Looks up city and state from India Post's public API. Returns null when unknown or unreachable. */
async function lookup(pincode: string) {
  if (cache.has(pincode)) return cache.get(pincode)!;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, { signal: AbortSignal.timeout(4000) });
    const data = (await res.json()) as { Status: string; PostOffice?: { District: string; State: string }[] }[];
    const office = data?.[0]?.Status === "Success" ? data[0].PostOffice?.[0] : undefined;
    const result = office ? { city: office.District, state: office.State } : null;
    cache.set(pincode, result);
    return result;
  } catch {
    return null;
  }
}

function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added++;
  }
  return d;
}

const fmt = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" });

export async function checkPincode(pincode: string): Promise<PincodeInfo | null> {
  const place = await lookup(pincode);
  if (!place) return null;
  const now = new Date();
  return {
    pincode,
    ...place,
    serviceable: true,
    estimate: { from: fmt.format(addBusinessDays(now, SITE.deliveryDays.min)), to: fmt.format(addBusinessDays(now, SITE.deliveryDays.max)) },
  };
}
