import prisma, { type Db } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export async function getCoupons(db: Db = prisma) {
  return db.coupon.findMany({
    where: { isActive: true },
    orderBy: { discountPercent: 'desc' },
  });
}

export async function validateCoupon(code: string, db: Db = prisma) {
  const coupon = await db.coupon.findUnique({
    where: { code, isActive: true },
  });

  if (!coupon) {
    throw new AppError(400, 'Invalid or inactive coupon code');
  }

  return {
    valid: true,
    discountPercent: coupon.discountPercent,
    name: coupon.name,
  };
}
