import { z } from "zod/v4";

const paramsWithIdSchema = z.object({
    id: z.string().transform((value) => {
        const parsedId = parseInt(value);
        if (isNaN(parsedId)) {
            throw new Error("Invalid ID format");
        }
        return parsedId;
    })
})

const createUserBodySchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    birthDate: z.string().transform((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
        }
        return date;
    })
})

const updateUserBodySchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.email("Invalid email format").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
    birthDate: z.string().transform((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
        }
        return date;
    }).optional()
})

type ParamsWithIdSchema = z.infer<typeof paramsWithIdSchema>;
type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;
type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;   

export {
    paramsWithIdSchema,
    createUserBodySchema,
    updateUserBodySchema,
    ParamsWithIdSchema,
    CreateUserBodySchema,
    UpdateUserBodySchema
}