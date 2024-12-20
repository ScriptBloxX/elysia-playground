import { Elysia, t } from 'elysia'

export const Model = new Elysia()
    .model({
        createReq: t.Object({
            username: t.String(),
            password: t.String(),
            email: t.String({format:"email"}),
        }),
        createRes: t.Object({
            id: t.Number(),
            username: t.String(),
            email: t.String({format:"email"}),
            token: t.String(),
            refreshToken: t.String(),
            isEmailVerified: t.Boolean(),
            profileUrl: t.Nullable(t.String()),
        })
    })

    // file_: t.Object({
    //     image: t.File()
    // })

