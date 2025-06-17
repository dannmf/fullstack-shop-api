import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../lib/jwt";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        const authHeader = request.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({ message: 'Token não encontrado' })
        }
        const token = authHeader.split(' ')[1]
        const decoded = verifyToken(token)

        if (typeof decoded === 'string') {
            return reply.status(401).send({ message: 'Token inválido' })
        }

        if (!decoded.id) {
            return reply.status(401).send({ message: 'Token inválido' })
        }

        request.user = { id: decoded.id }
    } catch (error) {
        console.error('Erro no middleware JWT:', error);
        return reply.status(401).send({ message: 'Erro ao verificar o token' });
    }
}