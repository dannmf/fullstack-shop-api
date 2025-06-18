import z from "zod/v4";

const paramsWithIdSchema = z.object({
    id: z.string().transform((value => {
        const parsedId = parseInt(value);
        if (isNaN(parsedId)) {
            throw new Error("Invalid ID format");
        }
        return parsedId;
    }))
})

const createProductBodySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be a positive number"),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
    categoryId: z.number().int().positive("Category ID must be a positive integer"),    
    imageUrl: z.string("Image URL must be a valid URL").optional()

    
})

const updateProductBodySchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    price: z.number().positive("Price must be a positive number").optional(),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer").optional(),
    categoryId: z.number().int().positive("Category ID must be a positive integer").optional(),
    imageUrl: z.string("Image URL must be a valid URL").optional()
})

type ParamsWithIdSchema = z.infer<typeof paramsWithIdSchema>;
type CreateProductBodySchema = z.infer<typeof createProductBodySchema>;
type UpdateProductBodySchema = z.infer<typeof updateProductBodySchema>;

export {
    paramsWithIdSchema,
    createProductBodySchema,
    updateProductBodySchema,
    ParamsWithIdSchema,
    CreateProductBodySchema,
    UpdateProductBodySchema
}