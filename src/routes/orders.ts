import { Router } from 'express';
import { postOrder, getOrders, postReorder } from '../controllers/orders.controller';

const router = Router();

router.post('/', postOrder);
router.get('/', getOrders);
router.post('/:id/reorder', postReorder);

export default router;
