import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryService } from "./category_service";
import { createCategoryBodySchema, CreateCategoryBodySchema, paramsWithIdSchema, ParamsWithIdSchema, UpdateCategoryBodySchema } from "./category_schema";
import { formatError } from "../../shared/utils/error/zod_error";

const categoryService = new CategoryService()

export const categoryController = {
    async create(request: FastifyRequest<{ Body: CreateCategoryBodySchema }>, reply: FastifyReply) {
        try {
            const result = createCategoryBodySchema.safeParse(request.body);
            if (!result.success) {
                return reply.status(400).send({
                    message: 'Dados inválidos',
                    errors: formatError(result)

                })
            }
            const { name } = result.data;

            const category = await categoryService.createCategory({
                name
            })
            return reply.status(201).send(category)
        } catch (error: any) {
            if (error.message === 'Categoria já cadastrada') {
                return reply.status(400).send({ message: 'Categoria já cadastrada' })
            }

            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    },

    async findAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const categories = await categoryService.findAll()
            return reply.send(categories)
        } catch (error: any) {
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    },

    async findById(request: FastifyRequest<{ Params: ParamsWithIdSchema }>, reply: FastifyReply) {
        try {

            const paramsResult = paramsWithIdSchema.safeParse(request.params);
            if (!paramsResult.success) {
                return reply.status(400).send({
                    message: 'ID inválido',
                    errors: formatError(paramsResult)

                })
            }

            const categoryId = paramsResult.data.id;
            const category = await categoryService.findById(categoryId)
            return reply.send(category)
        } catch (error: any) {
            if (error.message === 'Categoria não encontrada') {
                return reply.status(404).send({ message: error.message })
            }
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    },
    async update(request: FastifyRequest<{ Params: ParamsWithIdSchema, Body: UpdateCategoryBodySchema }>, reply: FastifyReply) {
        try {
            const paramsResult = paramsWithIdSchema.safeParse(request.params);
            if (!paramsResult.success) {
                return reply.status(400).send({
                    message: 'ID inválido',
                    errors: formatError(paramsResult)

                })
            }


            const bodyResult = createCategoryBodySchema.safeParse(request.body);
            if (!bodyResult.success) {
                return reply.status(400).send({
                    message: 'Dados inválidos',
                    errors: formatError(bodyResult)

                })
            }

            const categoryId = paramsResult.data.id;
            const data = bodyResult.data;
            const category = await categoryService.update(categoryId, data)
            return reply.send(category)
        } catch (error: any) {
            if (error.message === 'Categoria não encontrada') {
                return reply.status(404).send({ message: error.message })
            }
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    },

    async delete(request: FastifyRequest<{ Params: ParamsWithIdSchema }>, reply: FastifyReply) {
        try {
            const paramsResult = paramsWithIdSchema.safeParse(request.params);
            if (!paramsResult.success) {
                return reply.status(400).send({
                    message: 'ID inválido',
                    errors: formatError(paramsResult)

                })
            }
            const categoryId = paramsResult.data.id;

            await categoryService.delete(categoryId)
            return reply.status(204).send()
        } catch (error: any) {
            if (error.message === 'Categoria não encontrada') {
                return reply.status(404).send({ message: error.message })
            }
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }

    }

}

