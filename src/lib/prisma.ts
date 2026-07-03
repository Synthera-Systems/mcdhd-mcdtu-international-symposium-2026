import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const prismaClientSingleton = () => {
  // 1. Create a serverless connection pool using your database environment variable
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  
  // 2. Wrap it with the Prisma Pg Driver Adapter
  const adapter = new PrismaPg(pool);
  
  // 3. Inject the adapter into the Prisma Client instance
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;