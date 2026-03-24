import { Request, Response } from 'express';
import { productQuerySchema, parse } from '../lib/validations';
import { getProducts, getProductCategories } from '../services/products.service';

export async function listCategories(_req: Request, res: Response) {
  const categories = await getProductCategories();
  res.json(categories);
}

export async function listProducts(req: Request, res: Response) {
  const { shopId, category, sort, cursor, limit } = parse(productQuerySchema, req.query);

  const categories = category
    ? category.split(',').map((c) => c.trim()).filter(Boolean)
    : undefined;

  const data = await getProducts({ shopId, categories, sort, cursor, limit });
  res.json(data);
}
