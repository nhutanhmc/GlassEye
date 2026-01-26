import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(), // nếu không gửi sẽ auto slugify(name)
  brand: z.string().optional(),
  description: z.string().optional(),

  price: z.number().int().nonnegative(),
  salePrice: z.number().int().nonnegative().optional(),
  inStock: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),

  categoryId: z.string().optional(),

  imageUrl: z.string().url().optional(),
  imagePublicId: z.string().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();
