// Remembers the first campaign parameters a visitor arrived with, for the B2B enquiry form.
const KEY = "ts_utm";

export interface Utm {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export function captureUtm() {
  try {
    const p = new URLSearchParams(window.location.search);
    const utm: Utm = {
      utmSource: p.get("utm_source") ?? undefined,
      utmMedium: p.get("utm_medium") ?? undefined,
      utmCampaign: p.get("utm_campaign") ?? undefined,
    };
    if (utm.utmSource || utm.utmMedium || utm.utmCampaign) sessionStorage.setItem(KEY, JSON.stringify(utm));
  } catch {
    // Storage unavailable (private mode); enquiries still work without UTM.
  }
}

export function readUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Utm;
  } catch {
    return {};
  }
}

/** Pushes a conversion event to GA4 / Google Ads / Meta when their tags are installed. */
export function trackConversion(event: string, params: Record<string, string> = {}) {
  const w = window as unknown as { dataLayer?: unknown[]; fbq?: (...a: unknown[]) => void };
  w.dataLayer?.push({ event, ...params });
  w.fbq?.("track", "Lead", params);
}
