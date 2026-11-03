import { z } from "zod";

const rupees = z.coerce.number().min(1, "Enter a price").max(1_000_000);
const lines = (v: unknown) => (typeof v === "string" ? v.split("\n").map((s) => s.trim()).filter(Boolean) : []);

export const productFormSchema = z
  .object({
    name: z.string().trim().min(3).max(120),
    slug: z.string().trim().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only").max(120),
    sku: z.string().trim().min(2).max(40),
    description: z.string().trim().min(20, "Write at least a sentence or two").max(4000),
    highlights: z.preprocess(lines, z.array(z.string().max(120)).max(8)),
    images: z.preprocess(lines, z.array(z.string().regex(/^(\/|https:\/\/)/, "Image paths must start with / or https://")).min(1, "Add at least one image")),
    material: z.string().trim().max(120).optional(),
    dimensions: z.string().trim().max(120).optional(),
    safetyInfo: z.string().trim().max(300).optional(),
    mrp: rupees,
    salePrice: rupees,
    stockQty: z.coerce.number().int().min(0).max(100000),
    gstRate: z.coerce.number().int().refine((v) => [0, 5, 12, 18, 28].includes(v), "Choose a GST slab"),
    hsnCode: z.string().trim().max(12).optional(),
    brandId: z.string().optional(),
    categoryIds: z.array(z.string()).min(1, "Pick at least one category"),
    ageGroupIds: z.array(z.string()).min(1, "Pick at least one age group"),
    status: z.enum(["draft", "active", "archived"]),
    isBestSeller: z.coerce.boolean(),
    isNewArrival: z.coerce.boolean(),
    isDeal: z.coerce.boolean(),
    isB2bVisible: z.coerce.boolean(),
    seoTitle: z.string().trim().max(60, "Keep titles under 60 characters").optional(),
    seoDescription: z.string().trim().max(160).optional(),
  })
  .refine((v) => v.salePrice <= v.mrp, { message: "Sale price can't be more than MRP", path: ["salePrice"] });

export type ProductFormInput = z.infer<typeof productFormSchema>;
