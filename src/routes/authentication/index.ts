import Elysia from "elysia";
import { Model } from "./model";
import { Login, RefreshToken } from "./service";

export default new Elysia({prefix: '/authentication'})
    .use(Model)
    .post('/login', ({body}) => Login(body), {body:'loginReq',response:'loginRes'})
    .post('/refresh-token', ({ body }) => RefreshToken(body), {body: 'refreshToken' ,response: 'refreshTokenRes'})
