import Elysia from "elysia";
import { Create, Delete, Read, ReadAll, Update } from "./service";
import { Model } from "./model";

export default new Elysia({prefix: '/auth'})
    .use(Model)
    .get('/',()=> ReadAll())
    .get('/:id',()=> Read())
    .post('/',({body})=> Create(body),{body: 'create',response: 'create'})
    .patch('/',()=> Update())
    .delete('/',()=> Delete())
