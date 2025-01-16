
import Elysia from "elysia";
import { Create } from "./service";
import { Model } from "./model";

export default new Elysia({prefix: '/file'})
    .use(Model)
    .post('/',(req) => Create(req), {body:'fileReq',type: "multipart/form-data"})
