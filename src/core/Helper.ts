const bcrypt = require('bcrypt');
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

export async function hash(plainTextPassword: string, saltRounds: number = 12, miner: string = 'b'): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(plainTextPassword, salt)
        return hashedPassword
    } catch (err) {
        throw new Error('Error hashing password: ')
    }
}

export async function hashCompare(plainText: string, hashed: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(plainText, hashed);
        return isMatch; 
    } catch (err:any) {
        throw new Error('Error comparing hash: ' + err.message);
    }
}
export function validateEmailFormat(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
