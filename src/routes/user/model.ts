import { Elysia, t } from 'elysia'

export const Model = new Elysia()
    .model({
        create: t.Object({
            username: t.String(),
            password: t.String(),
            email: t.String(),
        })
    })

