import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Shops
  const mcdonalds = await prisma.shop.create({
    data: {
      name: "McDonald's",
      imageUrl: 'https://images.unsplash.com/photo-1552526881-721182498a74?w=400',
      rating: 4.5,
      category: 'Fast Food',
    },
  });

  const pizzeria = await prisma.shop.create({
    data: {
      name: 'Pizza Roma',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      rating: 4.7,
      category: 'Pizza',
    },
  });

  const sushi = await prisma.shop.create({
    data: {
      name: 'Sushi Master',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
      rating: 4.8,
      category: 'Sushi',
    },
  });

  const burger = await prisma.shop.create({
    data: {
      name: 'Burger House',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      rating: 4.3,
      category: 'Burgers',
    },
  });

  const cafe = await prisma.shop.create({
    data: {
      name: 'Morning Cafe',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
      rating: 4.6,
      category: 'Cafe',
    },
  });

  // McDonald's products
  await prisma.product.createMany({
    data: [
      { shopId: mcdonalds.id, name: 'Big Mac', imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400', price: 5.99, category: 'Burgers' },
      { shopId: mcdonalds.id, name: 'McChicken', imageUrl: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400', price: 4.99, category: 'Burgers' },
      { shopId: mcdonalds.id, name: 'French Fries', imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', price: 2.49, category: 'Sides' },
      { shopId: mcdonalds.id, name: 'Coca-Cola', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', price: 1.99, category: 'Drinks' },
      { shopId: mcdonalds.id, name: 'McFlurry', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', price: 3.49, category: 'Desserts' },
      { shopId: mcdonalds.id, name: 'Filet-O-Fish', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', price: 4.49, category: 'Burgers' },
      { shopId: mcdonalds.id, name: 'Apple Pie', imageUrl: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=400', price: 1.49, category: 'Desserts' },
      { shopId: mcdonalds.id, name: 'Orange Juice', imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', price: 2.29, category: 'Drinks' },
    ],
  });

  // Pizza Roma products
  await prisma.product.createMany({
    data: [
      { shopId: pizzeria.id, name: 'Margherita', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', price: 9.99, category: 'Pizza' },
      { shopId: pizzeria.id, name: 'Pepperoni', imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', price: 11.99, category: 'Pizza' },
      { shopId: pizzeria.id, name: 'BBQ Chicken', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', price: 12.99, category: 'Pizza' },
      { shopId: pizzeria.id, name: 'Caesar Salad', imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', price: 6.99, category: 'Salads' },
      { shopId: pizzeria.id, name: 'Garlic Bread', imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400', price: 3.99, category: 'Sides' },
      { shopId: pizzeria.id, name: 'Tiramisu', imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', price: 5.49, category: 'Desserts' },
      { shopId: pizzeria.id, name: 'Sparkling Water', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', price: 1.99, category: 'Drinks' },
      { shopId: pizzeria.id, name: 'Four Cheese', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', price: 13.49, category: 'Pizza' },
    ],
  });

  // Sushi Master products
  await prisma.product.createMany({
    data: [
      { shopId: sushi.id, name: 'California Roll', imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400', price: 8.99, category: 'Rolls' },
      { shopId: sushi.id, name: 'Salmon Nigiri', imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', price: 7.99, category: 'Nigiri' },
      { shopId: sushi.id, name: 'Dragon Roll', imageUrl: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=400', price: 13.99, category: 'Rolls' },
      { shopId: sushi.id, name: 'Miso Soup', imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', price: 2.99, category: 'Soups' },
      { shopId: sushi.id, name: 'Edamame', imageUrl: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400', price: 3.99, category: 'Sides' },
      { shopId: sushi.id, name: 'Tuna Sashimi', imageUrl: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400', price: 11.99, category: 'Sashimi' },
      { shopId: sushi.id, name: 'Green Tea', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', price: 2.49, category: 'Drinks' },
      { shopId: sushi.id, name: 'Spicy Tuna Roll', imageUrl: 'https://images.unsplash.com/photo-1617196034099-3b2d4e4e7b0f?w=400', price: 10.99, category: 'Rolls' },
    ],
  });

  // Burger House products
  await prisma.product.createMany({
    data: [
      { shopId: burger.id, name: 'Classic Burger', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', price: 7.99, category: 'Burgers' },
      { shopId: burger.id, name: 'Double Smash', imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400', price: 10.99, category: 'Burgers' },
      { shopId: burger.id, name: 'Veggie Burger', imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', price: 8.49, category: 'Burgers' },
      { shopId: burger.id, name: 'Onion Rings', imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', price: 3.49, category: 'Sides' },
      { shopId: burger.id, name: 'Milkshake', imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', price: 4.99, category: 'Drinks' },
      { shopId: burger.id, name: 'Coleslaw', imageUrl: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=400', price: 2.49, category: 'Sides' },
      { shopId: burger.id, name: 'Bacon Burger', imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', price: 9.99, category: 'Burgers' },
      { shopId: burger.id, name: 'Lemonade', imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', price: 2.99, category: 'Drinks' },
    ],
  });

  // Morning Cafe products
  await prisma.product.createMany({
    data: [
      { shopId: cafe.id, name: 'Espresso', imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400', price: 2.99, category: 'Coffee' },
      { shopId: cafe.id, name: 'Cappuccino', imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', price: 3.99, category: 'Coffee' },
      { shopId: cafe.id, name: 'Croissant', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', price: 2.99, category: 'Pastry' },
      { shopId: cafe.id, name: 'Avocado Toast', imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400', price: 7.99, category: 'Breakfast' },
      { shopId: cafe.id, name: 'Pancakes', imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', price: 6.99, category: 'Breakfast' },
      { shopId: cafe.id, name: 'Latte', imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400', price: 4.49, category: 'Coffee' },
      { shopId: cafe.id, name: 'Cheesecake', imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', price: 5.49, category: 'Desserts' },
      { shopId: cafe.id, name: 'Fresh OJ', imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', price: 3.49, category: 'Drinks' },
    ],
  });

  // Coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'SAVE10', name: '10% Off Your Order', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400', discountPercent: 10, isActive: true },
      { code: 'WELCOME20', name: 'Welcome Discount 20%', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', discountPercent: 20, isActive: true },
      { code: 'SUMMER15', name: 'Summer Sale 15%', imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400', discountPercent: 15, isActive: true },
      { code: 'FREESHIP', name: 'Free Delivery 5%', imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400', discountPercent: 5, isActive: true },
    ],
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
