import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth_service";

const authService = new AuthService()

interface LoginBody {
    email: string
    password: string
}

export const authController = {
    async login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
        try {
            const { email, password } = request.body
            const { user, token } = await authService.login({ email, password })
            return reply.status(200).send({ user, token })
            
        } catch (error: any) {
            if (error.message === 'Usuário não encontrado') {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }
            if (error.message === 'Senha inválida') {
                return reply.status(401).send({ message: 'Senha inválida' })
            }
            return reply.status(500).send({ message: 'Erro interno do servidor' })
        }
    }
}