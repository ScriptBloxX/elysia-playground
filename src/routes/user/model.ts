import { Elysia, t } from 'elysia'

export const Model = new Elysia()
    .model({
        createReq: t.Object({
            username: t.String(),
            password: t.String(),
            email: t.String(),
        }),
        createRes: t.Object({
            id: t.Number(),
            username: t.String(),
            email: t.String(),
            token: t.String(),
            refreshToken: t.String(),
            isEmailVerified: t.Boolean(),
            role: t.String(),
            profileUrl: t.Nullable(t.String()),
        }),
        updateReq: t.Object({
            username: t.Nullable(t.String()),
            password: t.Nullable(t.String()),
            email: t.Nullable(t.String()),
            profileUrl: t.Nullable(t.String()),
        }),
        updateRes: t.Object({
            id: t.Number(),
            username: t.String(),
            email: t.String(),
            isEmailVerified: t.Boolean(),
            profileUrl: t.Nullable(t.String()),
        }),
        forgotPasswordReq: t.Object({
            email: t.String()
        }),
        resetPasswordReq: t.Object({
            token: t.String(),
            password: t.String()
        })
    })

    // file_: t.Object({
    //     image: t.File()
    // })

