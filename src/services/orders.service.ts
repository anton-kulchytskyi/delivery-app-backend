import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export async function createOrder(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  couponCode?: string;
  items: { productId: string; quantity: number }[];
}) {
  const { name, email, phone, address, couponCode, items } = data;

  // Fetch all products in one query
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    throw new AppError(400, 'One or more products not found');
  }

  // Validate coupon if provided
  let discount = 0;
  let validCouponCode: string | undefined;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode, isActive: true },
    });
    if (!coupon) {
      throw new AppError(400, 'Invalid or inactive coupon code');
    }
    discount = coupon.discountPercent;
    validCouponCode = coupon.code;
  }

  // Calculate total
  const productMap = new Map(products.map((p) => [p.id, p]));
  const subtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const totalPrice = parseFloat(
    (subtotal * (1 - discount / 100)).toFixed(2),
  );

  // Create order with items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    return tx.order.create({
      data: {
        name,
        email,
        phone,
        address,
        totalPrice,
        couponCode: validCouponCode,
        discount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: productMap.get(item.productId)!.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });
  });

  return order;
}

export async function searchOrders(params: {
  id?: string;
  email?: string;
  phone?: string;
}) {
  const { id, email, phone } = params;

  if (id) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    return order ? [order] : [];
  }

  return prisma.order.findMany({
    where: { email, phone },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  });
}

export async function reorder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  return order.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    priceAtOrder: item.priceAtOrder,
    product: item.product,
  }));
}
