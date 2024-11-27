import { PrismaClient } from "@prisma/client";
import nodemailer, { SentMessageInfo } from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
const bcrypt = require('bcrypt');
const {getStorage, ref, getDownloadURL,uploadBytesResumable} = require('firebase/storage')
const {initializeApp} = require('firebase/app')

const prisma = new PrismaClient();

const serviceAccount = {
    type: process.env['auth_provider_x509_cert_url'],
    project_id: process.env['project_id'],
    private_key_id: process.env['private_key_id'],
    private_key: process.env['private_key'],
    client_email: process.env['client_email'],
    client_id: process.env['client_id'],
    auth_uri: process.env['auth_uri'],
    token_uri: process.env['token_uri'],
    auth_provider_x509_cert_url: process.env['auth_provider_x509_cert_url'],
    client_x509_cert_url: process.env['client_x509_cert_url'],
    storageBucket:process.env['storageBucket']
}

const JWT_SECRET = process.env.JWT_SECRET || "No-Way-Null_Secret"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "No-Way-Null_Secret"

initializeApp(serviceAccount);

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

export async function hash(plainText: string, saltRounds: number = 12, miner: string = 'b'): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(plainText, salt)
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

interface File {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
}
interface UploadResponse {
    downloadURLs: string[];
}

export async function fileUpload(files: File[] | undefined,RandomName?: boolean,CustomName?: string): Promise<UploadResponse> {
    if (!files) throw new Error('File missing');
    if (files.length > 1 && CustomName) throw new Error('Custom name can only be used with a single file');
    
    const storage = getStorage();
    const downloadURLs: string[] = [];

    const uploadPromises = files.map(async (element) => {
    const storageRef = ref(
        storage,
        `image/${RandomName ? uuidv4() : CustomName || element.originalname}`
    );

    const metadata = { contentType: element.mimetype };

    const snapshot = await uploadBytesResumable(storageRef, element.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    downloadURLs.push(downloadURL);
    return downloadURLs;
    });

    await Promise.all(uploadPromises);

    return { downloadURLs };
}

export async function generateAccessToken (userId: number,username:string,role:string) {
    const _test = jwt.sign({ userId,username,role }, JWT_SECRET, { expiresIn: process.env.TOKEN_TIME });
    console.log(_test,'test')
    return _test;
};

export async function generateRefreshToken (userId: number) {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_TIME });
};

export async function verifyAccessToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export async function verifyRefreshToken(refreshToken: string, userId: number) {
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
        if (decoded.userId !== userId) throw new Error('Token does not match the user');
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
}
