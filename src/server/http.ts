import "server-only";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ZodError, type ZodType, type ZodTypeDef } from "zod";
import { AppError } from "./errors";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.status });
  }
  if (error instanceof ZodError) {
    const first = error.issues[0];
    return NextResponse.json(
      { error: { code: "invalid_input", message: first?.message ?? "Invalid input", fields: error.flatten().fieldErrors } },
      { status: 422 },
    );
  }
  console.error(error);
  return NextResponse.json({ error: { code: "server_error", message: "Something went wrong. Please try again." } }, { status: 500 });
}

export async function parseJson<T>(req: Request, schema: ZodType<T, ZodTypeDef, unknown>): Promise<T> {
  const body = await req.json().catch(() => {
    throw new AppError("invalid_json", "Request body must be JSON");
  });
  return schema.parse(body);
}

/** Wraps a route handler so thrown errors become JSON responses. */
export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    try {
      return await fn(...args);
    } catch (e) {
      return fail(e);
    }
  };
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

const buckets = new Map<string, number[]>();

/** Simple in-memory sliding-window limiter. Enough for one instance; swap for Redis when scaling out. */
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) throw new AppError("rate_limited", "Too many attempts. Please wait a moment and try again.", 429);
  hits.push(now);
  buckets.set(key, hits);
}
