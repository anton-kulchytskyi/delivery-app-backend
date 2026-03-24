import { describe, it, expect, vi } from 'vitest';
import { getCoupons, validateCoupon } from './coupons.service';
import type { Db } from '../lib/prisma';

const makeDb = (overrides: Partial<Db>): Db => overrides as Db;

describe('coupons service', () => {
  describe('getCoupons', () => {
    it('returns active coupons', async () => {
      const mockCoupons = [
        { id: '1', code: 'SAVE10', discountPercent: 10, isActive: true },
      ];
      const db = makeDb({
        coupon: { findMany: vi.fn().mockResolvedValue(mockCoupons) } as never,
      });

      const result = await getCoupons(db);

      expect(result).toEqual(mockCoupons);
      expect(db.coupon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } }),
      );
    });
  });

  describe('validateCoupon', () => {
    it('returns discount info for valid coupon', async () => {
      const mockCoupon = {
        id: '1', code: 'WELCOME20', name: 'Welcome Discount 20%',
        discountPercent: 20, isActive: true,
      };
      const db = makeDb({
        coupon: { findUnique: vi.fn().mockResolvedValue(mockCoupon) } as never,
      });

      const result = await validateCoupon('WELCOME20', db);

      expect(result).toEqual({ valid: true, discountPercent: 20, name: 'Welcome Discount 20%' });
    });

    it('throws 400 for invalid coupon', async () => {
      const db = makeDb({
        coupon: { findUnique: vi.fn().mockResolvedValue(null) } as never,
      });

      await expect(validateCoupon('FAKE', db)).rejects.toMatchObject({ statusCode: 400 });
    });

    it('throws 400 for inactive coupon', async () => {
      const db = makeDb({
        coupon: { findUnique: vi.fn().mockResolvedValue(null) } as never,
      });

      await expect(validateCoupon('OLDCODE', db)).rejects.toMatchObject({ statusCode: 400 });
    });
  });
});
