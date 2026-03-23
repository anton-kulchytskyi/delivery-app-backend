import prisma from '../lib/prisma';

export async function getShops(ratingMin?: number, ratingMax?: number) {
const hasFilter = ratingMin !== undefined || ratingMax !== undefined;

  return prisma.shop.findMany({
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
