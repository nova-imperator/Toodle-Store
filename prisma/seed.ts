import { PrismaClient } from "@prisma/client";
// Store structure only (categories, ages, banners, admin, coupon). Products come from
// prisma/data/imported-products.json via sync-imported.ts, or are added in the admin panel.
import { CATEGORIES, AGE_GROUPS } from "../src/config/catalogue";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();
const paise = (rupees: number) => rupees * 100;

const BANNERS = [
  {
    eyebrow: "Every child deserves one",
    title: "Toys for every age, delivered to your door",
    subtitle: "Learning toys, musical toys, remote control toys and more. Free delivery on orders of ₹2,000+.",
    ctaLabel: "Shop all toys",
    ctaHref: "/shop",
    image: "/images/hero/starting-49.webp",
    theme: "red",
  },
  {
    eyebrow: "Wheels, wings and remotes",
    title: "Remote control toys",
    subtitle: "Fly, drive and play with easy-to-use remote control toys for older kids.",
    ctaLabel: "See RC toys",
    ctaHref: "/category/remote-control-toys",
    image: "/images/hero/vehicles.webp",
    theme: "blue",
  },
  {
    eyebrow: "Birthday sorted",
    title: "Gifts they'll actually play with",
    subtitle: "Pick an age and a budget in our gift finder. Delivered anywhere in India.",
    ctaLabel: "Find a gift",
    ctaHref: "/#gift-h",
    image: "/images/hero/birthday.webp",
    theme: "orange",
  },
  {
    eyebrow: "For shops, schools and resellers",
    title: "Starting a toy business?",
    subtitle: "Buy in bulk at wholesale prices. No minimum order, GST invoice, delivery across India.",
    ctaLabel: "Start now",
    ctaHref: "/b2b",
    image: "/images/hero/b2b.webp",
    theme: "ink",
  },
];

/** Admin login and starter coupon. Safe to run on every deploy: existing rows are left unchanged. */
async function seedAccounts() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: {},
      create: { name: "Store Admin", email: adminEmail, role: "admin", passwordHash: await hashPassword(adminPassword) },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "TOODLE10" },
    update: {},
    create: { code: "TOODLE10", type: "percent", value: 10, minOrder: paise(499) },
  });
}

/** Banners have no admin editor yet, so the copy above is the source of truth on every deploy. */
async function syncBanners() {
  await prisma.$transaction([prisma.banner.deleteMany(), prisma.banner.createMany({ data: BANNERS.map((b, i) => ({ ...b, sortOrder: i })) })]);
}

async function main() {
  await seedAccounts();
  await syncBanners();

  // Deploy builds pass --if-empty so an existing catalogue is never replaced.
  if (process.argv.includes("--if-empty") && (await prisma.category.count()) > 0) {
    console.log("Catalogue already loaded, skipping catalogue seed.");
    return;
  }

  await prisma.$transaction([
    prisma.productCategory.deleteMany(),
    prisma.productAgeGroup.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.ageGroup.deleteMany(),
    prisma.brand.deleteMany(),
  ]);

  for (const [i, c] of CATEGORIES.entries()) {
    await prisma.category.create({
      data: {
        name: c.name, slug: c.slug, color: c.color, sortOrder: i, description: c.intro,
        image: `/images/categories/${c.slug}.webp`,
        seoTitle: `${c.name} for Kids – Buy Online at Best Price`,
        seoDescription: c.intro.slice(0, 155),
      },
    });
  }

  for (const a of AGE_GROUPS) {
    await prisma.ageGroup.create({
      data: {
        name: a.name, slug: a.slug, minAgeMonths: a.minAgeMonths, maxAgeMonths: a.maxAgeMonths,
        color: a.color, description: a.intro,
        seoTitle: `Toys for ${a.name} – Buy Online`,
        seoDescription: a.intro.slice(0, 155),
      },
    });
  }

  console.log(`Seeded ${CATEGORIES.length} categories and ${AGE_GROUPS.length} age groups.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
