import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middleware/errorHandler';
import shopsRouter from './routes/shops';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import couponsRouter from './routes/coupons';
import { swaggerSpec } from './swagger';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/shops', shopsRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/coupons', couponsRouter);

app.use(errorHandler);

export default app;
