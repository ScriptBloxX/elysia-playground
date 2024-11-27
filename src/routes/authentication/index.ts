import Elysia from "elysia";
import { Model } from "./model";
import { Login } from "./service";

export default new Elysia({prefix: '/authentication'})
    .use(Model)
    .post('/login', ({body}) => Login(body), {body:'loginReq',response:'loginRes'})
