import dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if(!process.env.DATABASE_URL){
    throw new Error("Databae URL is missing")
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
