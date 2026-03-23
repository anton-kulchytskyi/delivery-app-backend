import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { errorHandler } from './middleware/errorHandler';
import shopsRouter from './routes/shops';
import productsRouter from './routes/products';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/shops', shopsRouter);
app.use('/products', productsRouter);

app.use(errorHandler);

export default app;
