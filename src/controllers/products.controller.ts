import { Request, Response } from 'express';
import { productQuerySchema } from '../lib/validations';
import { getProducts } from '../services/products.service';
import { AppError } from '../middleware/errorHandler';

export async function listProducts(req: Request, res: Response) {
  const result = productQuerySchema.safeParse(req.query);
  if (!result.success) {
    throw new AppError(400, result.error.issues[0]?.message ?? 'Invalid query');
  }

  const { shopId, category, sort, cursor, limit } = result.data;

  const categories = category
    ? category.split(',').map((c) => c.trim()).filter(Boolean)
    : undefined;

  const data = await getProducts({ shopId, categories, sort, cursor, limit });
  res.json(data);
}
