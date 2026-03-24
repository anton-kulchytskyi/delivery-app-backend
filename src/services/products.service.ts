import prisma, { type Db } from '../lib/prisma';
import { paginateProducts } from '../lib/pagination';

export async function getProducts(
  params: {
    shopId?: string;
    categories?: string[];
    sort?: 'price_asc' | 'price_desc' | 'name_asc';
    cursor?: string;
    limit: number;
  },
  db: Db = prisma,
) {
  return paginateProducts(params, db);
}
