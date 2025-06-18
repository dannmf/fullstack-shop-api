import { FastifyRequest, FastifyReply } from 'fastify'
import { UsersService } from './user_service'
import { createUserBodySchema, CreateUserBodySchema, paramsWithIdSchema, ParamsWithIdSchema, updateUserBodySchema, UpdateUserBodySchema } from './user_schema'
import { formatError } from '../../shared/utils/error/zod_error'
const usersService = new UsersService()

export const usersController = {
  async create(request: FastifyRequest<{ Body: CreateUserBodySchema }>, reply: FastifyReply) {
    try {
      const result = createUserBodySchema.safeParse(request.body)
      if (!result.success) {
        return reply.status(400).send({
          message: 'Dados inválidos',
          errors: formatError(result)
        })
      }
      const user = await usersService.createUser({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
        birthDate: result.data.birthDate
      })

      return reply.status(201).send(user)
    } catch (error: any) {
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        return reply.status(400).send({ message: 'Email já cadastrado' })
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  },

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await usersService.findAll()
      return reply.send(users)
    } catch (error) {
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  },

  async findById(request: FastifyRequest<{ Params: ParamsWithIdSchema }>, reply: FastifyReply) {
    try {
      const result = paramsWithIdSchema.safeParse(request.params)
      if (!result.success) {
        return reply.status(400).send({
          message: 'ID inválido',
          errors: formatError(result)

        })
      }
      const userId = result.data.id

      const user = await usersService.findById(userId)
      return reply.send(user)
    } catch (error: any) {
      if (error.message === 'Usuário não encontrado') {
        return reply.status(404).send({ message: error.message })
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  },


  async update(request: FastifyRequest<{ Params: ParamsWithIdSchema, Body: UpdateUserBodySchema }>, reply: FastifyReply) {
    try {
      const resultParams = paramsWithIdSchema.safeParse(request.params)
      if (!resultParams.success) {
        return reply.status(400).send({
          message: 'ID inválido',
          errors: formatError(resultParams)

        })
      }

      const resultBody = updateUserBodySchema.safeParse(request.body)
      if (!resultBody.success) {
        return reply.status(400).send({
          message: 'Dados inválidos',
          errors: formatError(resultBody)

        })
      }



      const user = await usersService.update(resultParams.data.id, {
        name: resultBody.data.name,
        email: resultBody.data.email,
        birthDate: resultBody.data.birthDate
      })


      return reply.send(user)
    } catch (error) {
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  },


  async delete(request: FastifyRequest<{ Params: ParamsWithIdSchema }>, reply: FastifyReply) {
    try {
      const result = paramsWithIdSchema.safeParse(request.params)
      if (!result.success) {
        return reply.status(400).send({
          message: 'ID inválido',
          errors: formatError(result)

        })
      }
      const userId = result.data.id

      await usersService.delete(userId)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}