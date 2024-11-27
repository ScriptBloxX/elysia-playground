import { verifyAccessToken } from "../core/Helper";

export default async function mw() {
    return console.log('middleware is work!'); 
}

export async function authMiddleware(ctx: any, next: any) {
    const authHeader = ctx.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authentication required');
    }

    const token = authHeader.slice(7);

    try {
        const user = await verifyAccessToken(token);
        ctx.user = user;
        return next();
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}
