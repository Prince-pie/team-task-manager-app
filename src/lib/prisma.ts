import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
      return new PrismaClient({
              datasourceUrl: process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy"
      } as any)
}

declare global {
      var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
