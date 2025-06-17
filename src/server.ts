import Fastify from 'fastify'
import cors from '@fastify/cors'
import { userRoutes } from './domains/user/user_routes';
import { productRoutes } from './domains/product/product_routes';
import { authenticate } from './shared/middlewares/authenticate';
import { authRoutes } from './domains/auth/auth_routes';
import { categoryRoutes } from './domains/category/category_routes';

const app = Fastify({ logger: true })

app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
});

app.register(authRoutes)
app.register(userRoutes);
app.register(productRoutes);
app.register(categoryRoutes);

const start = async () => {
    try {
        await app.listen({ port: 3333, host: '0.0.0.0' })
        console.log('Servidor rodando em http://localhost:3333')
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()