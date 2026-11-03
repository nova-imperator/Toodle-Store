/**
 * Demo mode for the approval preview (Vercel). Set DEMO_MODE="true" to show login codes on screen
 * and use simulated payments when real email / Razorpay keys are not configured.
 * Must be off on the live site.
 */
export const isDemoMode = () => process.env.DEMO_MODE === "true";
