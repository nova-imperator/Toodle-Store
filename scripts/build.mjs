// Production build: generate the Prisma client, apply migrations, load the demo catalogue into an
// empty database, then build Next.js. Works with any Postgres connected through Vercel Storage.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Local builds read .env; on Vercel the variables come from the project settings.
if (existsSync(".env")) process.loadEnvFile(".env");

const isPg = (v) => /^postgres(ql)?:\/\//.test(v ?? "");

// Vercel integrations name the connection string differently (and may add a custom prefix).
const candidates = Object.keys(process.env).filter((k) => /(^|_)(DATABASE_URL|POSTGRES_URL)$/.test(k) && isPg(process.env[k]));
const source = ["DATABASE_URL", "POSTGRES_URL", ...candidates].find((k) => isPg(process.env[k]));

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

// Serverless Postgres (Prisma Postgres, Neon) can take longer than Prisma's 5 s default to wake up.
const withTimeout = (url) => (/[?&]connect_timeout=/.test(url) ? url : `${url}${url.includes("?") ? "&" : "?"}connect_timeout=30`);
process.env.DATABASE_URL = withTimeout(process.env[source]);
const unpooled = Object.keys(process.env).find((k) => /(^|_)(DATABASE_URL_UNPOOLED|POSTGRES_URL_NON_POOLING)$/.test(k) && isPg(process.env[k]));
process.env.DATABASE_URL_UNPOOLED = withTimeout(unpooled ? process.env[unpooled] : process.env.DATABASE_URL);

function run(cmd, { attempts = 1 } = {}) {
  for (let i = 1; i <= attempts; i++) {
    console.log(`\n▶ ${cmd}${attempts > 1 ? ` (attempt ${i}/${attempts})` : ""}`);
    const { status } = spawnSync(cmd, { stdio: "inherit", shell: true, env: process.env });
    if (status === 0) return;
    if (i < attempts) spawnSync(process.execPath, ["-e", "setTimeout(() => {}, 10000)"]);
    else process.exit(status ?? 1);
  }
}

run("npx prisma generate");
run("npx prisma migrate deploy", { attempts: 3 });
run("npx tsx prisma/seed.ts --if-empty", { attempts: 2 });
run("npx next build");
