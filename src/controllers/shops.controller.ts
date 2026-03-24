import { Request, Response } from 'express';
import { shopQuerySchema, parse } from '../lib/validations';
import { getShops, getShopById } from '../services/shops.service';

export async function listShops(req: Request, res: Response) {
  const { rating_min, rating_max } = parse(shopQuerySchema, req.query);
  const shops = await getShops(rating_min, rating_max);
  res.json(shops);
}

export async function getShop(req: Request, res: Response) {
  const shop = await getShopById(String(req.params['id']));
  res.json(shop);
}
