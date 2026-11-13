import "server-only";
import { deliveryWindow } from "@/lib/delivery";

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

const fmt = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

export async function checkPincode(pincode: string): Promise<PincodeInfo | null> {
  const place = await lookup(pincode);
  if (!place) return null;
  const window = deliveryWindow(new Date());
  return { pincode, ...place, serviceable: true, estimate: { from: fmt.format(window.from), to: fmt.format(window.to) } };
}
