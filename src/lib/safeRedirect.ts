/** Only allows same-site relative paths, so ?next= cannot send people to another site. */
export function safeNext(value: string | string[] | undefined, fallback = "/account"): string {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}
