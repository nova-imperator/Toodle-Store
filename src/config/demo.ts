/**
 * Demo mode for the approval preview (Vercel). Set DEMO_MODE=true to show login codes on screen
 * and use simulated payments when real email / Razorpay keys are not configured.
 * Must be off on the live site. Accepts true / "true" / True / 1 / yes, ignoring spaces and quotes.
 */
export const isDemoMode = () => ["true", "1", "yes"].includes((process.env.DEMO_MODE ?? "").trim().replace(/^["']|["']$/g, "").toLowerCase());
