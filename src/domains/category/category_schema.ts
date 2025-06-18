import { th } from "zod/dist/types/v4/locales";
import z from "zod/v4";

const paramsWithIdSchema = z.object({
    id: z.string().transform((value) => {
        const parsedId = parseInt(value);
        if(isNaN(parsedId)){
            throw new Error("Invalid ID format");
        }
        return parsedId;
    })
})

const createCategoryBodySchema = z.object({
    name: z.string().min(1, "Name is required"),
})

const updateCategoryBodySchema = z.object({
    name: z.string().min(1, "Name is required"),
})

type ParamsWithIdSchema = z.infer<typeof paramsWithIdSchema>;
type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>;
type UpdateCategoryBodySchema = z.infer<typeof updateCategoryBodySchema>;

export {
    paramsWithIdSchema,
    createCategoryBodySchema,
    updateCategoryBodySchema,
    ParamsWithIdSchema,
    CreateCategoryBodySchema,
    UpdateCategoryBodySchema
}