import Elysia from "elysia";
import { Create, Read, ReadAll, Update, Delete } from "./service";
import { Model } from "./model";

export default new Elysia({prefix: '/authentication'})
    .use(Model)
    .get('/', (params) => ReadAll(params), {})
    .get('/:id', (params) => Read(params), {})
    .post('/', (params) => Create(params), {})
    .patch('/', (params) => Update(params), {})
    .delete('/', (params) => Delete(params), {});
