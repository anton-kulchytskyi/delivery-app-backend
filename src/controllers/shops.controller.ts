import { Request, Response } from 'express';
import { shopQuerySchema, parse } from '../lib/validations';
import { getShops } from '../services/shops.service';

export async function listShops(req: Request, res: Response) {
  const { rating_min, rating_max } = parse(shopQuerySchema, req.query);
  const shops = await getShops(rating_min, rating_max);
  res.json(shops);
}
