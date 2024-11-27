import authenticationRoute from './routes/authentication';
import userRoute from './routes/user';
import { Elysia, t } from 'elysia';
import { swagger } from "@elysiajs/swagger";
import cors from '@elysiajs/cors';
import { rateLimit } from 'elysia-rate-limit';

const app = new Elysia();

app.use(swagger())
app
.listen(3000,()=>console.log(`server is runnnig at: http://localhost:${3000}/`))
    .use(cors())
    .use(rateLimit({
        duration: 1000,
        max: 10,
        errorResponse: new Response("Rate limit reached", {
            status: 429,
            headers: new Headers({
                'Content-Type': 'text/plain',
                'Custom-Header': 'custom',
            }),
        }),
    }),)
    // # ↘ Please don't edit this manually ↙ //
    .group('/api',(app)=>app.use(userRoute))
    .group('/api', (app) => app.use(authenticationRoute))
