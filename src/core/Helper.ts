import { PrismaClient } from "@prisma/client";
import nodemailer, { SentMessageInfo } from 'nodemailer';
const bcrypt = require('bcrypt');

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

export function validateThaiIdCard(idCard: string): void {
    if (!/^\d{13}$/.test(idCard)) {
        throw new Error('Invalid ID card format. It should be exactly 13 digits.');
    }

    const digits = idCard.split('').map(Number);
    const weights = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 12; i++) {
        sum += digits[i] * weights[i];
    }

    const remainder = sum % 11;
    const checksum = (11 - remainder) % 10;

    if (checksum !== digits[12]) {
        throw new Error('Invalid ID card: checksum does not match.');
    }
}

export async function sendEmail(to: string, option: {subject: string,html:string}): Promise<boolean> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env['SERVER_MAIL_USERNAME'],
            pass: process.env['SERVER_MAIL_PASSWORD']
        }
    });

    const mailOptions = {
        from: process.env['SERVER_MAIL_USERNAME'],
        to: to,
        subject: option.subject,
        html: option.html
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err: Error | null, info: SentMessageInfo) => {
            if (err) {
                throw new Error(`Email sending failed: ${err.message}`);
            } else {
                // console.log('Email sent:', info.response);
                resolve(true);
            }
        });
    });
}