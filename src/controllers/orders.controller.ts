import { Request, Response } from 'express';
import { createOrderSchema, orderSearchSchema } from '../lib/validations';
import { createOrder, searchOrders, reorder } from '../services/orders.service';
import { AppError } from '../middleware/errorHandler';

export async function postOrder(req: Request, res: Response) {
  const result = createOrderSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(400, result.error.issues[0]?.message ?? 'Invalid body');
  }

  const order = await createOrder(result.data);
  res.status(201).json(order);
}

export async function getOrders(req: Request, res: Response) {
  const result = orderSearchSchema.safeParse(req.query);
  if (!result.success) {
    throw new AppError(400, result.error.issues[0]?.message ?? 'Invalid query');
  }

  const { id, email, phone } = result.data;

  if (!id && !(email && phone)) {
    throw new AppError(400, 'Provide either order id or both email and phone');
  }

  const orders = await searchOrders({ id, email, phone });
  res.json(orders);
}

export async function postReorder(req: Request, res: Response) {
  const id = String(req.params['id'] ?? '');
  if (!id) throw new AppError(400, 'Order id is required');

  const items = await reorder(id);
  res.json(items);
}
