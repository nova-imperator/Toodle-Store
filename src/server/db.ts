import "server-only";
import { PrismaClient } from "@prisma/client";

// Vercel Storage integrations may name the connection string POSTGRES_URL or add a prefix
// (e.g. STORAGE_DATABASE_URL). Same lookup as scripts/build.mjs.
const isPg = (v?: string) => !!v && /^postgres(ql)?:\/\//.test(v);
const findEnv = (pattern: RegExp) => Object.keys(process.env).find((k) => pattern.test(k) && isPg(process.env[k]));

if (!isPg(process.env.DATABASE_URL)) {
  const key = isPg(process.env.POSTGRES_URL) ? "POSTGRES_URL" : findEnv(/(^|_)(DATABASE_URL|POSTGRES_URL)$/);
  if (key) process.env.DATABASE_URL = process.env[key];
}
process.env.DATABASE_URL_UNPOOLED ||= process.env[findEnv(/(^|_)(DATABASE_URL_UNPOOLED|POSTGRES_URL_NON_POOLING)$/) ?? ""] || process.env.DATABASE_URL;

// Serverless Postgres may need a few seconds to wake; keep few connections per function instance.
if (process.env.DATABASE_URL && !/[?&]connect_timeout=/.test(process.env.DATABASE_URL)) {
  const sep = process.env.DATABASE_URL.includes("?") ? "&" : "?";
  process.env.DATABASE_URL += `${sep}connect_timeout=30${process.env.VERCEL ? "&connection_limit=3" : ""}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
