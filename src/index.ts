import userRoute from './routes/user'
import { Elysia, t } from 'elysia'
import { swagger } from "@elysiajs/swagger";
import cors from '@elysiajs/cors';

const app = new Elysia();

app.use(swagger())
app
.listen(3000,()=>console.log(`server is runnnig at: http://localhost:${3000}/`))
    .use(cors())
    // # ↘ Please don't edit this manually ↙ //
    .group('/api',(app)=>app.use(userRoute))
    