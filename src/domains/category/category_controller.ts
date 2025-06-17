import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryService } from "./category_service";

const categoryService = new CategoryService()

interface ParamsWithId {
    id: string
}

interface CreateCategoryBody {
    name: string
}

interface UpdateCategoryBody {
    name: string
}

export const categoryController = {
    async create(request: FastifyRequest<{ Body: CreateCategoryBody }>, reply: FastifyReply) {
        try {
            const { name } = request.body
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

    async findById(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
        try {
            const { id } = request.params
            const categoryId = parseInt(id, 10)
            if (isNaN(categoryId)) {
                return reply.status(400).send({ message: 'ID inválido' })
            }
            const category = await categoryService.findById(categoryId)
            return reply.send(category)
        } catch (error: any) {
            if (error.message === 'Categoria não encontrada') {
                return reply.status(404).send({ message: error.message })
            }
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    },
    async update(request: FastifyRequest<{ Params: ParamsWithId, Body: UpdateCategoryBody }>, reply: FastifyReply) {
        try {
            const { id } = request.params
            const categoryId = parseInt(id, 10)
            const data = request.body
            if (isNaN(categoryId)) {
                return reply.status(400).send({ message: 'ID inválido' })
            }
            const category = await categoryService.update(categoryId, data)
            return reply.send(category)
        } catch (error: any) {
            if (error.message === 'Categoria não encontrada') {
                return reply.status(404).send({ message: error.message })
            }
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    },

    async delete(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
        try {
            const { id } = request.params
            const categoryId = parseInt(id, 10)

            if (isNaN(categoryId)) {
                return reply.status(400).send({ message: 'ID inválido' })
            }

            await categoryService.delete(categoryId)
            return reply.status(204).send()
        } catch(error: any) {
            if (error.message === 'Categoria não encontrada') {
                return reply.status(404).send({ message: error.message })
            }
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }   
        
    }

}

