// Indian mobile numbers in forms (owner, 28 Nov 2026: "put validation on the phone number").

export const MOBILE_ERROR = "Enter a valid 10-digit mobile number (starts with 6, 7, 8 or 9)";

/** While typing/pasting: keep digits only, drop a +91 / 91 / 0 prefix, max 10 digits. */
export function cleanMobileInput(value: string): string {
  let d = value.replace(/\D/g, "");
  // "+91…" is always the country code, even if the rest is too short (then it's flagged as invalid).
  if (value.trim().startsWith("+91")) d = d.slice(2);
  else if (d.length > 10 && d.startsWith("91")) d = d.slice(2);
  if (d.length > 10 && d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 10);
}

export const isValidMobile = (value: string) => /^[6-9]\d{9}$/.test(value);

/** Error to show after the field is left, or undefined when fine / still empty. */
export const mobileError = (value: string) => (value && !isValidMobile(value) ? MOBILE_ERROR : undefined);
