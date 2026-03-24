import { describe, it, expect, vi } from 'vitest';
import { paginateProducts } from './pagination';
import type { Db } from './prisma';

const makeDb = (findMany: ReturnType<typeof vi.fn>): Db =>
  ({ product: { findMany } } as unknown as Db);

describe('paginateProducts', () => {
  it('returns data and null nextCursor when results fit in limit', async () => {
    const mockProducts = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
    const db = makeDb(vi.fn().mockResolvedValue(mockProducts));

    const result = await paginateProducts({ limit: 5 }, db);

    expect(result.data).toHaveLength(2);
    expect(result.nextCursor).toBeNull();
  });

  it('returns nextCursor when there are more results', async () => {
    const mockProducts = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
      { id: '3', name: 'C' },
    ];
    const db = makeDb(vi.fn().mockResolvedValue(mockProducts));

    const result = await paginateProducts({ limit: 2 }, db);

    expect(result.data).toHaveLength(2);
    expect(result.nextCursor).toBe('2');
  });

  it('passes cursor to db when provided', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const db = makeDb(findMany);

    await paginateProducts({ limit: 12, cursor: 'abc-123' }, db);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ cursor: { id: 'abc-123' }, skip: 1 }),
    );
  });

  it('filters by shopId when provided', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const db = makeDb(findMany);

    await paginateProducts({ limit: 12, shopId: 'shop-1' }, db);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ shopId: 'shop-1' }) }),
    );
  });
});
