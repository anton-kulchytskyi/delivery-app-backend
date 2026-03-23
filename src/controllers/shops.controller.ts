import { Request, Response } from 'express';
import { shopQuerySchema } from '../lib/validations';
import { getShops } from '../services/shops.service';
import { AppError } from '../middleware/errorHandler';

export async function listShops(req: Request, res: Response) {
  const result = shopQuerySchema.safeParse(req.query);
  if (!result.success) {
    throw new AppError(400, result.error.issues[0]?.message ?? 'Invalid query');
  }

  const { rating_min, rating_max } = result.data;
  const shops = await getShops(rating_min, rating_max);
  res.json(shops);
}
