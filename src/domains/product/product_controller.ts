import { Prisma, PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { ProductsService } from "./product_service";

const productService = new ProductsService()

interface ParamsWithId {
    id: string
}

interface CreateProductBody {
    name: string
    description: string
    price: number
    stock: number
    categoryId: number
    imageUrl: string

}

interface UpdateProductBody {
    name?: string
    description?: string
    price?: number
    stock?: number
    categoryId?: number
    imageUrl?: string

}
export const productController = {
    async create(request: FastifyRequest<{ Body: CreateProductBody }>, reply: FastifyReply) {
        try {
            const { name, description, price, stock, categoryId, imageUrl } = request.body
            const product = await productService.createProduct({
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                categoryId: Number(categoryId),
                imageUrl
            })
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

    async findById(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
        try {
            const { id } = request.params
            const productId = parseInt(id, 10)

            if (isNaN(productId)) {
                return reply.status(400).send({ message: 'ID Inválido' })
            }

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

    async update(request: FastifyRequest<{ Params: ParamsWithId, Body: UpdateProductBody }>, reply: FastifyReply) {
        try {
            const { id } = request.params
            const productId = parseInt(id, 10)
            const data = request.body

            if (isNaN(productId)) {
                return reply.status(400).send({ message: 'ID Inválido' })
            }

            const product = await productService.update(productId, {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                stock: Number(data.stock),
                categoryId: Number(data.categoryId),
                imageUrl: data.imageUrl,
            })

            return reply.send(product)

        } catch (error: any) {
            return reply.status(500).send({ message: 'Erro interno no servidor' })
        }
    },

    async delete(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
        try {
            const { id } = request.params
            const productId = parseInt(id, 10)

            if (isNaN(productId)) {
                return reply.status(400).send({ message: 'ID inválido' })
            }

            await productService.delete(productId)
            return reply.status(204).send()
        } catch (error) {
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    }

}
