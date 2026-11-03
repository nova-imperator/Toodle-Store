export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

/** JSON fetch for the browser. Throws ApiError with the server's friendly message. */
export async function api<T>(url: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(url, {
    method: options.method ?? (options.body ? "POST" : "GET"),
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = data?.error ?? {};
    throw new ApiError(e.message ?? "Something went wrong. Please try again.", e.code ?? "error", res.status, e.fields);
  }
  return data as T;
}
