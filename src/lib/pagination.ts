import prisma, { type Db } from './prisma';
import type { Product } from '../generated/prisma/client';

export interface CursorPage<T> {
  data: T[];
  nextCursor: string | null;
}

export async function paginateProducts(
  params: {
    shopId?: string;
    categories?: string[];
    sort?: 'price_asc' | 'price_desc' | 'name_asc';
    cursor?: string;
    limit: number;
  },
  db: Db = prisma,
): Promise<CursorPage<Product>> {
  const { shopId, categories, sort, cursor, limit } = params;

  const orderBy = sort === 'price_asc'
    ? { price: 'asc' as const }
    : sort === 'price_desc'
    ? { price: 'desc' as const }
    : sort === 'name_asc'
    ? { name: 'asc' as const }
    : { name: 'asc' as const };

  const where = {
    ...(shopId ? { shopId } : {}),
    ...(categories && categories.length > 0 ? { category: { in: categories } } : {}),
  };

  const items = await db.product.findMany({
    where,
    orderBy,
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? (data[data.length - 1]?.id ?? null) : null;

  return { data, nextCursor };
}
