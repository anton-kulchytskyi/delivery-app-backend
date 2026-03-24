import { z, ZodSchema } from 'zod';
import { AppError } from '../middleware/errorHandler';

export function parse<T>(schema: ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError(400, result.error.issues[0]?.message ?? 'Invalid');
  }
  return result.data;
}

export const shopQuerySchema = z.object({
  rating_min: z.coerce.number().min(0).max(5).optional(),
  rating_max: z.coerce.number().min(0).max(5).optional(),
});

export const productQuerySchema = z.object({
  shopId: z.string().uuid().optional(),
  category: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc']).optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const createOrderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});

export const orderSearchSchema = z
  .object({
    id: z.string().uuid().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.id !== undefined || (data.email !== undefined && data.phone !== undefined), {
    message: 'Provide either order id or both email and phone',
  });

export const couponValidateSchema = z.object({
  code: z.string().min(1),
});
