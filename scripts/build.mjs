// Production build: generate the Prisma client, apply migrations, then build Next.js.
// Works with any Postgres provider connected through Vercel Storage (Neon, Prisma Postgres, …).
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Local builds read .env; on Vercel the variables come from the project settings.
if (existsSync(".env")) process.loadEnvFile(".env");

// Vercel integrations name the connection string differently (and may add a custom prefix).
const candidates = Object.keys(process.env).filter((k) => /(^|_)(DATABASE_URL|POSTGRES_URL)$/.test(k) && /^postgres(ql)?:\/\//.test(process.env[k] ?? ""));
const source = ["DATABASE_URL", "POSTGRES_URL", ...candidates].find((k) => /^postgres(ql)?:\/\//.test(process.env[k] ?? ""));

if (!source) {
  // Names only, never values, so the log shows what the integration provided.
  const related = Object.keys(process.env).filter((k) => /DATABASE|POSTGRES|PRISMA|NEON|PG/i.test(k));
  console.error(`\nDatabase-related variables visible to this build: ${related.length ? related.join(", ") : "none"}`);
  console.error(
    "\n✖ No Postgres connection string found (looked for DATABASE_URL, POSTGRES_URL and *_DATABASE_URL / *_POSTGRES_URL).\n" +
      "  On Vercel: Storage → connect a Postgres database to this project (all environments), then redeploy.\n" +
      "  Locally: copy .env.example to .env.\n",
  );
  process.exit(1);
}
if (source !== "DATABASE_URL") console.log(`Using ${source} as DATABASE_URL`);
process.env.DATABASE_URL = process.env[source];
const unpooled = Object.keys(process.env).find((k) => /(^|_)(DATABASE_URL_UNPOOLED|POSTGRES_URL_NON_POOLING)$/.test(k) && process.env[k]);
process.env.DATABASE_URL_UNPOOLED = (unpooled && process.env[unpooled]) || process.env.DATABASE_URL;

for (const cmd of ["npx prisma generate", "npx prisma migrate deploy", "npx next build"]) {
  console.log(`\n▶ ${cmd}`);
  const { status } = spawnSync(cmd, { stdio: "inherit", shell: true, env: process.env });
  if (status !== 0) process.exit(status ?? 1);
}
