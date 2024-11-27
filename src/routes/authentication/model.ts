import { Elysia, t } from 'elysia'

export const Model = new Elysia()
    .model({
        loginReq: t.Object({
            usernameOrEmail: t.String(),
            password: t.String()
        }),
        loginRes: t.Object({
            id: t.Number(),
            username: t.String(),
            email: t.String(),
            token: t.String(),
            refreshToken: t.String(),
            isEmailVerified: t.Boolean(),
            profileUrl: t.String(),
            role: t.String()
        }),
    })
