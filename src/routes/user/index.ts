import Elysia from "elysia";
import { Create, Delete, Read, ReadAll, Update } from "./service";
import { Model } from "./model";
import { auth } from "../../middleware/mw";

export default new Elysia({prefix: '/user'})
    .use(Model)
    .get('/',()=> ReadAll())
    .get('/:id',({params})=> Read(params))
    .post('/',({body})=>Create(body),{body: 'createReq',response: 'createRes'})
    
    .onBeforeHandle(auth)
    .patch('/' ,()=> Update())
    .delete('/',auth,()=> Delete())
