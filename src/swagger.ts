import swaggerJsdoc from 'swagger-jsdoc';

const BASE_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : 'http://localhost:3000';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delivery App API',
      version: '1.0.0',
      description: 'REST API for the Delivery App food ordering platform',
    },
    servers: [{ url: BASE_URL }],
    components: {
      schemas: {
        Shop: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            imageUrl: { type: 'string' },
            rating: { type: 'number' },
            category: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            shopId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            imageUrl: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            totalPrice: { type: 'number' },
            couponCode: { type: 'string', nullable: true },
            discount: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            productId: { type: 'string', format: 'uuid' },
            quantity: { type: 'integer' },
            priceAtOrder: { type: 'number' },
            product: { $ref: '#/components/schemas/Product' },
          },
        },
        Coupon: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string' },
            name: { type: 'string' },
            imageUrl: { type: 'string' },
            discountPercent: { type: 'number' },
            isActive: { type: 'boolean' },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          tags: ['System'],
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } } } } },
          },
        },
      },
      '/shops': {
        get: {
          summary: 'List all shops',
          tags: ['Shops'],
          parameters: [
            { in: 'query', name: 'rating_min', schema: { type: 'number', minimum: 0, maximum: 5 }, description: 'Minimum rating filter' },
            { in: 'query', name: 'rating_max', schema: { type: 'number', minimum: 0, maximum: 5 }, description: 'Maximum rating filter' },
          ],
          responses: {
            200: { description: 'List of shops', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Shop' } } } } },
          },
        },
      },
      '/shops/{id}': {
        get: {
          summary: 'Get shop by ID',
          tags: ['Shops'],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'Shop details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Shop' } } } },
            404: { description: 'Shop not found' },
          },
        },
      },
      '/products': {
        get: {
          summary: 'List products with filtering, sorting and pagination',
          tags: ['Products'],
          parameters: [
            { in: 'query', name: 'shopId', schema: { type: 'string', format: 'uuid' }, description: 'Filter by shop' },
            { in: 'query', name: 'category', schema: { type: 'string' }, description: 'Filter by category (comma-separated for multiple)' },
            { in: 'query', name: 'sort', schema: { type: 'string', enum: ['price_asc', 'price_desc', 'name_asc'] } },
            { in: 'query', name: 'cursor', schema: { type: 'string', format: 'uuid' }, description: 'Cursor for pagination' },
            { in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 50, default: 12 } },
          ],
          responses: {
            200: {
              description: 'Paginated product list',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                      nextCursor: { type: 'string', nullable: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/products/categories': {
        get: {
          summary: 'List all distinct product categories',
          tags: ['Products'],
          responses: {
            200: { description: 'List of category names', content: { 'application/json': { schema: { type: 'array', items: { type: 'string' } } } } },
          },
        },
      },
      '/orders': {
        post: {
          summary: 'Create a new order',
          tags: ['Orders'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'phone', 'address', 'items'],
                  properties: {
                    name: { type: 'string', minLength: 2, maxLength: 100 },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string', example: '+380991234567' },
                    address: { type: 'string', minLength: 5, maxLength: 200 },
                    couponCode: { type: 'string' },
                    items: {
                      type: 'array',
                      minItems: 1,
                      items: {
                        type: 'object',
                        required: ['productId', 'quantity'],
                        properties: {
                          productId: { type: 'string', format: 'uuid' },
                          quantity: { type: 'integer', minimum: 1 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Order created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
            400: { description: 'Validation error' },
          },
        },
        get: {
          summary: 'Search orders by phone or order ID',
          tags: ['Orders'],
          parameters: [
            { in: 'query', name: 'phone', schema: { type: 'string' }, description: 'Phone number used when ordering' },
            { in: 'query', name: 'id', schema: { type: 'string', format: 'uuid' }, description: 'Order ID' },
          ],
          responses: {
            200: { description: 'List of matching orders', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
            400: { description: 'Must provide phone or id' },
          },
        },
      },
      '/orders/{id}/reorder': {
        post: {
          summary: 'Get items from a previous order for reordering',
          tags: ['Orders'],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: {
              description: 'Order items',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string', format: 'uuid' },
                        quantity: { type: 'integer' },
                        priceAtOrder: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Order not found' },
          },
        },
      },
      '/coupons': {
        get: {
          summary: 'List all active coupons',
          tags: ['Coupons'],
          responses: {
            200: { description: 'List of coupons', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Coupon' } } } } },
          },
        },
      },
      '/coupons/validate': {
        post: {
          summary: 'Validate a coupon code',
          tags: ['Coupons'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['code'],
                  properties: { code: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Coupon validation result',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      valid: { type: 'boolean' },
                      discountPercent: { type: 'number' },
                      name: { type: 'string' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid or inactive coupon' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
