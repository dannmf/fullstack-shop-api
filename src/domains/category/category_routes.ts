import { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { categoryController } from "./category_controller";

export async function categoryRoutes(fastify: FastifyInstance) {
    fastify.post('/category', {
        preHandler: authenticate,
        handler: categoryController.create
    })

    fastify.get('/category', {
        preHandler: authenticate,
        handler: categoryController.findAll
    })

    fastify.get('/category/:id', {
        preHandler: authenticate,
        handler: categoryController.findById
    })

    fastify.put('/category/:id', {
        preHandler: authenticate,
        handler: categoryController.update
    })

    fastify.delete('/category/:id', {
        preHandler: authenticate,
        handler: categoryController.delete
    })
}