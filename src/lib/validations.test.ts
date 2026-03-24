import { describe, it, expect } from 'vitest';
import {
  createOrderSchema,
  couponValidateSchema,
  shopQuerySchema,
  productQuerySchema,
  orderSearchSchema,
} from './validations';

describe('validations', () => {
  describe('createOrderSchema', () => {
    const validOrder = {
      name: 'John Doe',
      email: 'john@test.com',
      phone: '+380991234567',
      address: 'Kyiv, Khreshchatyk 1',
      items: [{ productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 1 }],
    };

    it('accepts valid order', () => {
      const result = createOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, email: 'not-email' });
      expect(result.success).toBe(false);
    });

    it('rejects empty items array', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, items: [] });
      expect(result.success).toBe(false);
    });

    it('rejects short phone', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, phone: '123' });
      expect(result.success).toBe(false);
    });

    it('accepts order with coupon', () => {
      const result = createOrderSchema.safeParse({ ...validOrder, couponCode: 'SAVE10' });
      expect(result.success).toBe(true);
    });
  });

  describe('couponValidateSchema', () => {
    it('accepts valid code', () => {
      const result = couponValidateSchema.safeParse({ code: 'SAVE10' });
      expect(result.success).toBe(true);
    });

    it('rejects empty code', () => {
      const result = couponValidateSchema.safeParse({ code: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('shopQuerySchema', () => {
    it('accepts valid rating range', () => {
      const result = shopQuerySchema.safeParse({ rating_min: '4.0', rating_max: '5.0' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rating_min).toBe(4.0);
        expect(result.data.rating_max).toBe(5.0);
      }
    });

    it('rejects rating above 5', () => {
      const result = shopQuerySchema.safeParse({ rating_min: '6' });
      expect(result.success).toBe(false);
    });

    it('accepts empty query', () => {
      const result = shopQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('productQuerySchema', () => {
    it('applies default limit of 12', () => {
      const result = productQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(12);
      }
    });

    it('accepts valid sort value', () => {
      const result = productQuerySchema.safeParse({ sort: 'price_asc' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid sort value', () => {
      const result = productQuerySchema.safeParse({ sort: 'random' });
      expect(result.success).toBe(false);
    });
  });

  describe('orderSearchSchema', () => {
    it('accepts search by id only', () => {
      const result = orderSearchSchema.safeParse({ id: '123e4567-e89b-12d3-a456-426614174000' });
      expect(result.success).toBe(true);
    });

    it('accepts search by email and phone', () => {
      const result = orderSearchSchema.safeParse({ email: 'john@test.com', phone: '+380991234567' });
      expect(result.success).toBe(true);
    });

    it('rejects empty query — neither id nor email+phone', () => {
      const result = orderSearchSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('rejects email without phone', () => {
      const result = orderSearchSchema.safeParse({ email: 'john@test.com' });
      expect(result.success).toBe(false);
    });
  });
});
