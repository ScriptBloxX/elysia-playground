import Elysia from "elysia";
import { Create, Delete, Read, ReadAll, Update } from "./service";
import { Model } from "./model";
import mw from "../../middleware/mw";

export default new Elysia({prefix: '/user'})
    .use(Model)
    .onBeforeHandle(mw) //midleware example
    .get('/',()=> ReadAll())
    .get('/:id',()=> Read())
    .post('/',({body})=> Create(body),{body: 'create',response: 'create'})
    .patch('/',()=> Update())
    .delete('/',()=> Delete())
