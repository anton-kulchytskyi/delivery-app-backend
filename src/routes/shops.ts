import { Router } from 'express';
import { listShops } from '../controllers/shops.controller';

const router = Router();

router.get('/', listShops);

export default router;
