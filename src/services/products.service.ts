import { paginateProducts } from '../lib/pagination';

export async function getProducts(params: {
  shopId?: string;
  categories?: string[];
  sort?: 'price_asc' | 'price_desc' | 'name_asc';
  cursor?: string;
  limit: number;
}) {
  return paginateProducts(params);
}
