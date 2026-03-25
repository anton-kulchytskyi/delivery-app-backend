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
  shopId: z.uuid().optional(),
  category: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc']).optional(),
  cursor: z.uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const createOrderSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  phone: z.string().regex(/^\+38\d{10}$/, 'Enter 10 digits after +38'),
  address: z.string().min(5).max(200),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.uuid(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});

export const orderSearchSchema = z
  .object({
    id: z.uuid().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.id !== undefined || data.phone !== undefined, {
    message: 'Provide either order id or phone number',
  });

export const couponValidateSchema = z.object({
  code: z.string().min(1),
});
