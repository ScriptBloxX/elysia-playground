import { Elysia, t } from 'elysia'

export const Model = new Elysia()
    .model({
        fileReq: t.Object({
            files: t.Union([t.Array(t.File()), t.File()]),
        })
    })
