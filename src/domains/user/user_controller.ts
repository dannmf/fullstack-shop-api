import { FastifyRequest, FastifyReply } from 'fastify'
import { UsersService } from './user_service'
const usersService = new UsersService()

interface ParamsWithId {
  id: string
}

interface CreateUserBody {
  name: string,
  email: string,
  password: string,
  birthDate: Date
}

interface UpdateUserBody {
  name?: string,
  email?: string,
  password?: string,
  birthDate?: Date
}


export const usersController = {
  async create(request: FastifyRequest<{Body: CreateUserBody}>, reply: FastifyReply) {
    try {
      const { name, email, password, birthDate } = request.body 
      const user = await usersService.createUser({
        name,
        email,
        password,
        birthDate: new Date(birthDate)
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

  async findById(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const userId = parseInt(id, 10)

      if (isNaN(userId)) {
        return reply.status(400).send({ message: 'ID inválido' })
      }

      const user = await usersService.findById(userId)
      return reply.send(user)
    } catch (error: any) {
      if (error.message === 'Usuário não encontrado') {
        return reply.status(404).send({ message: error.message })
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  },


  async update(request: FastifyRequest<{ Params: ParamsWithId, Body: UpdateUserBody }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const userId = parseInt(id, 10)
      const data = request.body 

      if (isNaN(userId)) {
        return reply.status(400).send({ message: 'ID inválido' })
      }

      const user = await usersService.update(userId, {
        name: data.name,
        email: data.email,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined
      })

      if (data.password && data.password.trim() !== '') {
        user['password'] = data.password
      }

      return reply.send(user)
    } catch (error) {
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  },


  async delete(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
    try {
      const { id } = request.params
      const userId = parseInt(id, 10)

      if (isNaN(userId)) {
        return reply.status(400).send({ message: 'ID inválido' })
      }

      await usersService.delete(userId)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}