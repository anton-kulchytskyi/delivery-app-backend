import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export async function getCoupons() {
  return prisma.coupon.findMany({
    where: { isActive: true },
    orderBy: { discountPercent: 'desc' },
  });
}

export async function validateCoupon(code: string) {
  const coupon = await prisma.coupon.findUnique({
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
