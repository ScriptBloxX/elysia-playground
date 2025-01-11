import { JwtPayload } from "jsonwebtoken";
import prisma, { generateAccessToken, generateEmailToken, generateRefreshToken, hashCompare, sendEmail, verifyEmailToken, verifyRefreshToken } from "../../core/Helper";
const fs = require('fs');
const path = require('path');

const loadEmailTemplate = () => {
    const filePath = path.resolve(__dirname, '../..', 'template', 'EmailVerify.html');
    return fs.readFileSync(filePath, 'utf8'); 
};
const personalizeTemplate = (template:string, token:string,username:string) => {
    return template
    .replace('{{SERVER_ENDPOINT}}', `${process.env.BACKEND_EP}/api/authentication/verify/${token}`)
    .replace('{{USERNAME}}',username)
    .replace('{{Expires}}',process.env.VE_TOKEN_TIME || 'no limited.')
    .replaceAll('{{COMPANY}}',process.env.COMPANY || '');
};

export async function Login(body: any) {
    const { usernameOrEmail, password } = body

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: usernameOrEmail },
                { email: usernameOrEmail },
            ]
        }
    })

    if (!user) throw new Error('Invalid username or password');
    const passwordMatch = await hashCompare(password, user.password)
    if (!passwordMatch) throw new Error('Invalid username or password');

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

export async function RefreshToken(body: any) {
    const { refreshToken } = body;

    const tokenRecord = await prisma.token.findFirst({
        where: { refreshToken }
    });

    if (!tokenRecord) throw new Error('Invalid refresh token');

    const user = await prisma.user.findUnique({
        where: { id: tokenRecord.userId }
    });

    if (!user) throw new Error('User not found');

    const isValidRefreshToken = await verifyRefreshToken(refreshToken, user.id);
    if (!isValidRefreshToken) throw new Error('Invalid refresh token');

    const newAccessToken = await generateAccessToken(user.id, user.username, user.role);

    return { accessToken: newAccessToken };
}

export async function EmailVerify(params: any) {
    const verify = <JwtPayload>await verifyEmailToken(params.token);

    const user = await prisma.user.findUnique({
        where: { id: verify.userId },
        select: { email: true }
    });

    if (!user) throw new Error('User not found');
    
    if (user.email === verify.email) {
        await prisma.user.update({
            where: { id: verify.userId },
            data: { isEmailVerified: true }
        });
        return true;
    } else {
        throw new Error('Email is not match!');
    }
}

export async function SendEmailVerify(req:any){
    const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {username: true,email:true}
    });
    if(!user) throw new Error("User not found");

    const token = await generateEmailToken(req.user.userId,user.email)
    const EmailForm = personalizeTemplate(loadEmailTemplate(), token,user.username);

    await sendEmail(user.email,{
        subject: `${process.env.COMPANY} Verify Request`,
        html: EmailForm
    })
    return true;
}
