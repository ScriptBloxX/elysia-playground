import { PrismaClient } from "@prisma/client"
import { generateAccessToken, generateRefreshToken, hashCompare } from "../../core/Helper";

export async function Login(body: any) {
    const { usernameOrEmail, password } = body
    const prisma = new PrismaClient()

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: usernameOrEmail },
                { email: usernameOrEmail },
            ]
        }
    })

    if (!user) throw new Error('Invalid username or email');
    const passwordMatch = await hashCompare(password, user.password)
    if (!passwordMatch) throw new Error('Invalid password');

    const accessToken = await generateAccessToken(user.id, user.username, user.role);
    const refreshToken = await generateRefreshToken(user.id);

    await prisma.token.create({
        data: {
            userId: user.id,
            accessToken,
            refreshToken,
        }
    });

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        token: accessToken,
        refreshToken: refreshToken,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        profileUrl: user.profileUrl
    };
}
