import { Router } from 'express';
import { listShops, getShop } from '../controllers/shops.controller';

const router = Router();

router.get('/', listShops);
router.get('/:id', getShop);

export default router;
