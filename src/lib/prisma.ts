import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export type Db = Pick<PrismaClient, 'shop' | 'product' | 'order' | 'coupon' | '$transaction'>;

export default prisma;
