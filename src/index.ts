import userRoute from './routes/user'
import { Elysia, t } from 'elysia'
import { swagger } from "@elysiajs/swagger";

const app = new Elysia();
// don't edit this file ma
app.use(swagger())
app
.listen(3000,()=>console.log(`server is runnnig at: http://localhost:${3000}/`))
    .group('/api',(app)=>app.use(userRoute))
    