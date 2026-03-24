import prisma, { type Db } from '../lib/prisma';

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
