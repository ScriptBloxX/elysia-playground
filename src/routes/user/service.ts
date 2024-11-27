import { PrismaClient } from "@prisma/client";
import { generateAccessToken, generateRefreshToken, hash, validateEmailFormat, validatePassword, validateUsername } from "../../core/Helper";

export async function Create(body:any) {
    validateEmailFormat(body.email);
    validateUsername(body.username);
    validatePassword(body.password);

    const prisma = new PrismaClient()
    const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: body.email },
            { username: body.username }
          ]
        }
      });
    if (existingUser) {
        if (existingUser.email === body.email) {
            throw new Error("Email is already in use.");
        }
        if (existingUser.username === body.username) {
            throw new Error("Username is already taken.");
        }
    }

    const hashedPassword = await hash(body.password);

    const user = await prisma.user.create({
        data: {
            username: body.username,
            email: body.email,
            password: hashedPassword,
            role: body.role || "user",
            isEmailVerified: false, 
            isActive: true,         
            isDeleted: false,       
            createdBy: body.createdBy || null,
        },
    });

    const tk = await generateAccessToken(user.id,user.username,user.role);
    const rftk = await generateRefreshToken(user.id,user.username,user.role)
    await prisma.token.create({
    data: {
            userId: user.id,
            accessToken: tk,
            refreshToken: rftk,
        },
    });
     
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        token: tk,
        refreshToken: rftk
    };
}
export async function Read() {
    return 'Hello Read'
}
export async function ReadAll() {
    const prisma = new PrismaClient()
    const result = prisma.user.findMany()
    await prisma.$disconnect()

    return result
}
export async function Update() {
    return 'Hello Update'
}
export async function Delete() {
    return 'Hello Delete'
}
