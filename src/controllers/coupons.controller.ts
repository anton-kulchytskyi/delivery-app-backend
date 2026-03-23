import { Request, Response } from 'express';
import { couponValidateSchema } from '../lib/validations';
import { getCoupons, validateCoupon } from '../services/coupons.service';
import { AppError } from '../middleware/errorHandler';

export async function listCoupons(_req: Request, res: Response) {
  const coupons = await getCoupons();
  res.json(coupons);
}

export async function postValidateCoupon(req: Request, res: Response) {
  const result = couponValidateSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(400, result.error.issues[0]?.message ?? 'Invalid body');
  }

  const data = await validateCoupon(result.data.code);
  res.json(data);
}
