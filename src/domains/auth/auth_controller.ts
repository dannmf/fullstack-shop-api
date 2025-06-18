import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth_service";
import { authBodySchema, LoginBody } from "./auth_schema";

const authService = new AuthService()

export const authController = {
    async login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
        try {
            const result = authBodySchema.safeParse(request.body);

            if (!result.success) {
                return reply.status(400).send({
                    message: 'Dados inválidos',
                    errors: result.error
                });
            }

            const email = result.data.email;
            const password = result.data.password;

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
    },
}