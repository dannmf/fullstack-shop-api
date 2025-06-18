import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { ProductsService } from "./product_service";
import { createProductBodySchema, CreateProductBodySchema, ParamsWithIdSchema, updateProductBodySchema, UpdateProductBodySchema } from "./product_schema";
import { paramsWithIdSchema } from "../category/category_schema";
import { formatError } from "../../shared/utils/error/zod_error";

const productService = new ProductsService()

export const productController = {
    async create(request: FastifyRequest<{ Body: CreateProductBodySchema }>, reply: FastifyReply) {
        try {
            const result = createProductBodySchema.safeParse(request.body);
            if (!result.success) {
                return reply.status(400).send({
                    message: 'Dados inválidos',
                    errors: formatError(result)

                })
            }
            const product = result.data
            return reply.status(201).send(product)
        } catch (error: any) {
            console.error('Erro ao criar produto:', error)


            if (error.message === 'Produto já cadastrado') {
                return reply.status(400).send({ message: 'Produto já cadastrado' })
            }

            return reply.status(500).send({ message: 'Erro interno no servidor' })
        }
    },

    async findAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const products = await productService.findAll()
            return reply.send(products)
        } catch (error: any) {
            return reply.status(500).send({ message: 'Erro interno no servidor' })
        }
    },

    async findById(request: FastifyRequest<{ Params: ParamsWithIdSchema }>, reply: FastifyReply) {
        try {
            const result = paramsWithIdSchema.safeParse(request.params);
            if (!result.success) {
                return reply.status(400).send({
                    message: 'ID inválido',
                    errors: formatError(result)

                })
            }

            const productId = result.data.id;

            const product = await productService.findById(productId)
            return reply.send(product)
        } catch (error: any) {
            if (error.message === 'Produto não encontrado') {
                return reply.status(404).send({ message: error.message })
            }
            return reply.status(500).send({ message: 'Erro interno no servidor' })

        }
    },

    async countProducts(request: FastifyRequest, reply: FastifyReply) {
        try {
            const count = await productService.countProducts()
            return reply.send({ count })
        } catch (error: any) {
            console.error('Erro ao contar produtos:', error)
            return reply.status(500).send({ message: 'Erro interno no servidor' })
        }
    },

    async lowStockProducts(request: FastifyRequest, reply: FastifyReply) {
        try {
            const products = await productService.lowStockProducts()
            return reply.send(products)
        } catch (error: any) {

        }
    },

    async update(request: FastifyRequest<{ Params: ParamsWithIdSchema, Body: UpdateProductBodySchema }>, reply: FastifyReply) {
        try {
            const paramsResult = paramsWithIdSchema.safeParse(request.params)
            if (!paramsResult.success) {
                return reply.status(400).send({
                    message: 'ID inválido',
                    errors: formatError(paramsResult)

                })
            }
            const productId = paramsResult.data.id

            const bodyResult = updateProductBodySchema.safeParse(request.body)
            if (!bodyResult.success) {
                return reply.status(400).send({
                    message: 'Dados inválidos',
                    errors: formatError(bodyResult)

                })
            }

            const product = await productService.update(productId, {
                name: bodyResult.data.name,
                description: bodyResult.data.description,
                price: bodyResult.data.price,
                stock: bodyResult.data.stock,
                categoryId: bodyResult.data.categoryId,
                imageUrl: bodyResult.data.imageUrl,
            })

            return reply.send(product)

        } catch (error: any) {
            return reply.status(500).send({ message: 'Erro interno no servidor' })
        }
    },

    async delete(request: FastifyRequest<{ Params: ParamsWithIdSchema }>, reply: FastifyReply) {
        try {
            const result = paramsWithIdSchema.safeParse(request.params);
            if (!result.success) {
                return reply.status(400).send({
                    message: 'ID inválido',
                    errors: formatError(result)

                })
            }

            const productId = result.data.id;

            await productService.delete(productId)
            return reply.status(204).send()
        } catch (error) {
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    }

}
