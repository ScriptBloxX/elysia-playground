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
            profileUrl: 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
            isActive: true,         
            isDeleted: false,       
            createdBy: body.createdBy || null,
        },
    });

    const accessToken = await generateAccessToken(user.id,user.username,user.role);
    const refreshToken = await generateRefreshToken(user.id)
    await prisma.token.create({
    data: {
            userId: user.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    });
     
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        token: accessToken,
        refreshToken: refreshToken,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        profileUrl: user.profileUrl,
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
    console.log('print')
    return 'Hello Update'
}
export async function Delete() {
    return 'Hello Delete'
}
