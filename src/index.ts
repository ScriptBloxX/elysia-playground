import { Elysia, t } from 'elysia'
import { swagger } from "@elysiajs/swagger";
import userRoute from './routes/user'
import authRoute from './routes/auth'

const app = new Elysia();

app.use(swagger())
app
    .group('/api',(app)=>app.use(userRoute))
    .group('/api',(app)=>app.use(authRoute))
    .listen(3000,()=>console.log(`server is runnnig at: http://localhost:${3000}/`))

// 1 Elysia = 1 Controller (POST,GET,PUT,DELETE) CRUD
