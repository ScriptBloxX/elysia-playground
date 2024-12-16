import { verifyAccessToken } from "../core/Helper";

export async function auth(ctx: any) {
    const authHeader = ctx.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('Unauthorized');

    const token = authHeader.slice(7);
    try {
        const user = await verifyAccessToken(token);
        ctx.user = user;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}
