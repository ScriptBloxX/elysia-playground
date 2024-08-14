import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function executeWithPrisma<T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    let result: T;
    try {
        result = await callback(prisma);
    } finally {
        await prisma.$disconnect();
    }
    return result;
}

export default executeWithPrisma;

// use
// return executeWithPrisma(async (prisma) => {
//     return prisma.user.findMany();
// });
