import { FastifyInstance } from "fastify";
import { authenticate } from "../../shared/middlewares/authenticate";
import { productController } from "./product_controller";

export async function productRoutes(fastify: FastifyInstance) {
    fastify.post('/product', {
        preHandler: authenticate,
        handler: productController.create
    })

    fastify.get('/product', {
        preHandler: authenticate,
        handler: productController.findAll
    })

    fastify.get('/product/count', {
        preHandler: authenticate,
        handler: productController.countProducts
    })

    fastify.get('/product/lowStock', {
        preHandler: authenticate,
        handler: productController.lowStockProducts
    })

    fastify.get('/product/:id', {
        preHandler: authenticate,
        handler: productController.findById
    })

    fastify.put('/product/:id', {
        preHandler: authenticate,
        handler: productController.update
    })

    fastify.delete('/product/:id', {
        preHandler: authenticate,
        handler: productController.delete
    })
}