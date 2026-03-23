import { Router } from 'express';
import { listCoupons, postValidateCoupon } from '../controllers/coupons.controller';

const router = Router();

router.get('/', listCoupons);
router.post('/validate', postValidateCoupon);

export default router;
