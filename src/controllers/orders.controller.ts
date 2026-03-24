import { Request, Response } from 'express';
import { createOrderSchema, orderSearchSchema, parse } from '../lib/validations';
import { createOrder, searchOrders, reorder } from '../services/orders.service';
import { AppError } from '../middleware/errorHandler';


export async function postOrder(req: Request, res: Response) {
  const data = parse(createOrderSchema, req.body);
  const order = await createOrder(data);
  res.status(201).json(order);
}

export async function getOrders(req: Request, res: Response) {
  const { id, email, phone } = parse(orderSearchSchema, req.query);
  const orders = await searchOrders({ id, email, phone });
  res.json(orders);
}

export async function postReorder(req: Request, res: Response) {
  const id = String(req.params['id'] ?? '');
  if (!id) throw new AppError(400, 'Order id is required');

  const items = await reorder(id);
  res.json(items);
}
