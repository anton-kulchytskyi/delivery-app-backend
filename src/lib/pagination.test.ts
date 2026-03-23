import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma before importing pagination
vi.mock('./prisma', () => ({
  default: {
    product: {
      findMany: vi.fn(),
    },
  },
}));

import { paginateProducts } from './pagination';
import prisma from './prisma';

describe('paginateProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data and null nextCursor when results fit in limit', async () => {
    const mockProducts = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ];
    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as never);

    const result = await paginateProducts({ limit: 5 });

    expect(result.data).toHaveLength(2);
    expect(result.nextCursor).toBeNull();
  });

  it('returns nextCursor when there are more results', async () => {
    const mockProducts = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
      { id: '3', name: 'C' }, // extra item — signals hasMore
    ];
    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as never);

    const result = await paginateProducts({ limit: 2 });

    expect(result.data).toHaveLength(2);
    expect(result.nextCursor).toBe('2');
  });

  it('passes cursor to prisma when provided', async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([]);

    await paginateProducts({ limit: 12, cursor: 'abc-123' });

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: { id: 'abc-123' },
        skip: 1,
      }),
    );
  });

  it('filters by shopId when provided', async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([]);

    await paginateProducts({ limit: 12, shopId: 'shop-1' });

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ shopId: 'shop-1' }),
      }),
    );
  });
});
