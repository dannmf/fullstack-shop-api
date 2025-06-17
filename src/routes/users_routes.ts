import { FastifyInstance } from 'fastify'
import { usersController } from '../controllers/user_controller'
import { authenticate } from '../middlewares/authenticate'

export async function userRoutes(fastify: FastifyInstance) {

  fastify.post('/user', usersController.create)

  fastify.get('/user', {
    preHandler: authenticate,
    handler: usersController.findAll
  })

  fastify.get('/user/:id', {
    preHandler: authenticate,
    handler: usersController.findById
  })

  fastify.put('/user/:id', {
    preHandler: authenticate,
    handler: usersController.update
  })

  fastify.delete('/user/:id', {
    preHandler: authenticate,
    handler: usersController.delete
  })
}