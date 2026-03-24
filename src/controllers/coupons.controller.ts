import { Request, Response } from 'express';
import { couponValidateSchema, parse } from '../lib/validations';
import { getCoupons, validateCoupon } from '../services/coupons.service';

export async function listCoupons(_req: Request, res: Response) {
  const coupons = await getCoupons();
  res.json(coupons);
}

export async function postValidateCoupon(req: Request, res: Response) {
  const { code } = parse(couponValidateSchema, req.body);
  const data = await validateCoupon(code);
  res.json(data);
}
