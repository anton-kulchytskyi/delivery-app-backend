import prisma, { type Db } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export async function getShopById(id: string, db: Db = prisma) {
  const shop = await db.shop.findUnique({ where: { id } });
  if (!shop) throw new AppError(404, 'Shop not found');
  return shop;
}

export async function getShops(ratingMin?: number, ratingMax?: number, db: Db = prisma) {
  const hasFilter = ratingMin !== undefined || ratingMax !== undefined;

  return db.shop.findMany({
    where: hasFilter
      ? {
          rating: {
            ...(ratingMin !== undefined ? { gte: ratingMin } : {}),
            ...(ratingMax !== undefined ? { lte: ratingMax } : {}),
          },
        }
      : undefined,
    orderBy: { rating: 'desc' },
  });
}
