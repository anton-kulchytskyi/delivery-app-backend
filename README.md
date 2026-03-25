# Delivery App — Backend

REST API for a food delivery web application built as part of the ElifTech School test task.

> Frontend repo: [delivery-app-frontend](https://github.com/anton-kulchytskyi/delivery-app-frontend)

## Stack

- **Node.js** + **Express** + **TypeScript**
- **Prisma** ORM + **PostgreSQL**
- **Zod** for request validation
- Deployed on **Railway**

## Live

- API base URL: `https://delivery-app-backend-production-de2c.up.railway.app`
- Swagger UI: `https://delivery-app-backend-production-de2c.up.railway.app/api-docs`

## Run locally

```bash
npm install
cp .env.example .env   # set DATABASE_URL
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Testing

```bash
npm run test
```

Covers: coupon validation logic, cursor-based pagination helper.

## Complexity Level

**Advanced** — includes all Base, Middle, and Advanced requirements plus Bonus features (Coupons page, Order History with reorder).

## API overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/shops` | List shops (filter by rating) |
| GET | `/shops/:id` | Get shop by ID |
| GET | `/products` | List products (filter, sort, cursor pagination) |
| GET | `/products/categories` | Distinct product categories |
| POST | `/orders` | Create order |
| GET | `/orders` | Search orders by phone or ID |
| POST | `/orders/:id/reorder` | Get items from past order |
| GET | `/coupons` | List coupons |
| POST | `/coupons/validate` | Validate coupon code |

Full interactive docs at `/api-docs`.
