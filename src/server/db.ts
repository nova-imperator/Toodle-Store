import "server-only";
import { PrismaClient } from "@prisma/client";

// Providers other than Neon only set DATABASE_URL; the schema's directUrl then uses the same value.
process.env.DATABASE_URL_UNPOOLED ||= process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
