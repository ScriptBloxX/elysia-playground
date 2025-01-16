import Elysia from "elysia";
import { Create, Delete, ForgotPassword, Read, ReadAll, ResetPassword, Update } from "./service";
import { Model } from "./model";
import { auth } from "../../middleware/mw";

export default new Elysia({prefix: '/user'})
    .use(Model)
    .get('/',()=> ReadAll())
    .get('/:id',({params})=> Read(params))
    .post('/',({body})=>Create(body),{body: 'createReq',response: 'createRes'})
    .post('/forgot-password',({body})=>ForgotPassword(body), {body:'forgotPasswordReq'})
    .patch('/reset-password',(req)=>ResetPassword(req),{body:'resetPasswordReq'})

    .onBeforeHandle(auth)
    .patch('/' ,(req)=> Update(req),{body:'updateReq',response: 'updateRes'})
    .delete('/',(req)=> Delete(req))
