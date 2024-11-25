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
export function validateEmailFormat(email: string): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) throw new Error('Invalid email format');    
}

export function validateUsername(username: string): void {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) throw new Error('Username must be between 3 and 20 characters and can only contain letters, numbers, hyphens, and underscores.');
}
export function validatePassword(password: string): void {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) throw new Error('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
}
