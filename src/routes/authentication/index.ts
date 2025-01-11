import Elysia from "elysia";
import { Model } from "./model";
import { EmailVerify, Login, RefreshToken, SendEmailVerify } from "./service";
import { auth } from "../../middleware/mw";

export default new Elysia({prefix: '/authentication'})
    .use(Model)
    .post('/login', ({body}) => Login(body), {body:'loginReq',response:'loginRes'})
    .post('/refresh-token', ({ body }) => RefreshToken(body), {body: 'refreshTokenReq' ,response: 'refreshTokenRes'})
    .get('/verify/:token',({params})=>EmailVerify(params))
    
    .onBeforeHandle(auth)
    .post('/verify',(req)=>SendEmailVerify(req))
