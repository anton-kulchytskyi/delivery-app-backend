import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../lib/prisma', () => ({
  default: {
    coupon: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { getCoupons, validateCoupon } from './coupons.service';
import prisma from '../lib/prisma';

describe('coupons service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCoupons', () => {
    it('returns active coupons', async () => {
      const mockCoupons = [
        { id: '1', code: 'SAVE10', discountPercent: 10, isActive: true },
      ];
      vi.mocked(prisma.coupon.findMany).mockResolvedValue(mockCoupons as never);

      const result = await getCoupons();

      expect(result).toEqual(mockCoupons);
      expect(prisma.coupon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } }),
      );
    });
  });

  describe('validateCoupon', () => {
    it('returns discount info for valid coupon', async () => {
      const mockCoupon = {
        id: '1',
        code: 'WELCOME20',
        name: 'Welcome Discount 20%',
        discountPercent: 20,
        isActive: true,
      };
      vi.mocked(prisma.coupon.findUnique).mockResolvedValue(mockCoupon as never);

      const result = await validateCoupon('WELCOME20');

      expect(result).toEqual({
        valid: true,
        discountPercent: 20,
        name: 'Welcome Discount 20%',
      });
    });

    it('throws 400 for invalid coupon', async () => {
      vi.mocked(prisma.coupon.findUnique).mockResolvedValue(null);

      await expect(validateCoupon('FAKE')).rejects.toMatchObject({
        statusCode: 400,
        message: 'Invalid or inactive coupon code',
      });
    });

    it('throws 400 for inactive coupon', async () => {
      vi.mocked(prisma.coupon.findUnique).mockResolvedValue(null);

      await expect(validateCoupon('OLDCODE')).rejects.toMatchObject({
        statusCode: 400,
      });
    });
  });
});
