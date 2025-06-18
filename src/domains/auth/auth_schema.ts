import z from "zod/v4"

const authBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"), 
})

const forgotPasswordBodySchema = z.object({
    email: z.email(),
})

const resetPasswordBodySchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
})

type LoginBody = z.infer<typeof authBodySchema>
type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>
type resetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>

export {
    authBodySchema,
    forgotPasswordBodySchema,
    LoginBody,
    ForgotPasswordBody,
    resetPasswordBodySchema
}