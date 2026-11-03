import { PrismaClient } from "@prisma/client";
import { CATEGORIES, AGE_GROUPS, BRANDS } from "../src/config/catalogue";
import { PRODUCTS, SAFETY_BABY, SAFETY_SMALL_PARTS } from "./data/products";
import { slugify } from "../src/lib/slug";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();
const paise = (rupees: number) => rupees * 100;

const BANNERS = [
  {
    eyebrow: "Every child deserves one",
    title: "Toys starting at just ₹49",
    subtitle: "Spinning tops, pull-back cars and party favours. Free delivery across India.",
    ctaLabel: "Shop toys under ₹499",
    ctaHref: "/shop?max=499",
    image: "/images/hero/starting-49.webp",
    theme: "red",
  },
  {
    eyebrow: "Wheels, wings and remotes",
    title: "Race-ready RC cars and trucks",
    subtitle: "Rechargeable remote control cars, rock crawlers and stunt cars for 5 to 14 year olds.",
    ctaLabel: "See RC toys",
    ctaHref: "/category/remote-control-toys",
    image: "/images/hero/vehicles.webp",
    theme: "blue",
  },
  {
    eyebrow: "Birthday sorted",
    title: "Gift boxes and return gift packs",
    subtitle: "Ready-wrapped surprises picked by age. Add a message card for free.",
    ctaLabel: "Shop birthday gifts",
    ctaHref: "/category/birthday-gifts",
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

async function main() {
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
    prisma.banner.deleteMany(),
  ]);

  const categoryIds = new Map<string, string>();
  for (const [i, c] of CATEGORIES.entries()) {
    const row = await prisma.category.create({
      data: {
        name: c.name, slug: c.slug, color: c.color, sortOrder: i, description: c.intro,
        image: `/images/categories/${c.slug}.webp`,
        seoTitle: `${c.name} for Kids – Buy Online at Best Price`,
        seoDescription: c.intro.slice(0, 155),
      },
    });
    categoryIds.set(c.slug, row.id);
  }

  const ageIds = new Map<string, string>();
  for (const a of AGE_GROUPS) {
    const row = await prisma.ageGroup.create({
      data: {
        name: a.name, slug: a.slug, minAgeMonths: a.minAgeMonths, maxAgeMonths: a.maxAgeMonths,
        color: a.color, description: a.intro,
        seoTitle: `Toys for ${a.name} – Buy Online`,
        seoDescription: a.intro.slice(0, 155),
      },
    });
    ageIds.set(a.slug, row.id);
  }

  const brandIds = new Map<string, string>();
  for (const b of BRANDS) {
    const row = await prisma.brand.create({ data: b });
    brandIds.set(b.slug, row.id);
  }

  for (const p of PRODUCTS) {
    const slug = slugify(p.name);
    const isBabySafe = p.ages.includes("0-24-months");
    await prisma.product.create({
      data: {
        name: p.name, slug, sku: p.sku, description: p.description, highlights: p.highlights,
        material: p.material, dimensions: p.dimensions,
        safetyInfo: isBabySafe ? SAFETY_BABY : SAFETY_SMALL_PARTS,
        mrp: paise(p.mrp), salePrice: paise(p.price), stockQty: p.stock,
        brandId: brandIds.get(p.brand),
        hsnCode: "9503", gstRate: 18,
        isBestSeller: p.flags?.includes("best") ?? false,
        isNewArrival: p.flags?.includes("new") ?? false,
        isDeal: p.flags?.includes("deal") ?? false,
        seoTitle: `${p.name} – Buy Online`.slice(0, 60),
        seoDescription: p.description.slice(0, 155),
        categories: { create: p.categories.map((c) => ({ categoryId: categoryIds.get(c)! })) },
        ageGroups: { create: p.ages.map((a) => ({ ageGroupId: ageIds.get(a)! })) },
        images: {
          create: [
            { url: `/images/products/${slug}-1.webp`, altText: p.name, sortOrder: 0 },
            { url: `/images/products/${slug}-2.webp`, altText: `${p.name} in its box`, sortOrder: 1 },
            { url: `/images/products/${slug}-3.webp`, altText: `${p.name} close-up`, sortOrder: 2 },
          ],
        },
      },
    });
  }

  await prisma.banner.createMany({ data: BANNERS.map((b, i) => ({ ...b, sortOrder: i })) });

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

  console.log(`Seeded ${CATEGORIES.length} categories, ${AGE_GROUPS.length} age groups, ${PRODUCTS.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
