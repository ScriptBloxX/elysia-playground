import { Elysia, t } from 'elysia'

export const Model = new Elysia()
    .model({
        your_model_name: t.Object({
            key: t.String(),
        })
    })
