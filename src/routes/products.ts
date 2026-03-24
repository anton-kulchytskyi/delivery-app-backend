import { Router } from 'express';
import { listProducts, listCategories } from '../controllers/products.controller';

const router = Router();

router.get('/categories', listCategories);
router.get('/', listProducts);

export default router;
