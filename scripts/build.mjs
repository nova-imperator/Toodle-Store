// Production build: apply database migrations, then build Next.js.
// Works with any Postgres provider: Neon sets DATABASE_URL_UNPOOLED, others (e.g. Prisma Postgres)
// only set DATABASE_URL, which is then also used for migrations.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Local builds read .env; on Vercel the variables come from the project settings.
if (existsSync(".env")) process.loadEnvFile(".env");

if (!process.env.DATABASE_URL) {
  console.error(
    "\n✖ DATABASE_URL is not set.\n" +
      "  On Vercel: Storage → connect a Postgres database (Neon or Prisma Postgres) to this project, then redeploy.\n" +
      "  Locally: copy .env.example to .env.\n",
  );
  process.exit(1);
}
process.env.DATABASE_URL_UNPOOLED ||= process.env.DATABASE_URL;

for (const cmd of ["npx prisma migrate deploy", "npx next build"]) {
  console.log(`\n▶ ${cmd}`);
  const { status } = spawnSync(cmd, { stdio: "inherit", shell: true, env: process.env });
  if (status !== 0) process.exit(status ?? 1);
}
