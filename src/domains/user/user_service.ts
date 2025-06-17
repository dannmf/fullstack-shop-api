import { hash, compare } from "bcryptjs"
import { prisma } from "../../shared/lib/prisma"

export class UsersService {

    async createUser(data: {
        name: string
        email: string
        password: string
        birthDate: Date
    }) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (existingUser) {
            throw new Error('E-mail já cadastrado')
        }

        const hashedPassword = await hash(data.password, 10)

        return prisma.user.create({
            data:{
                name: data.name,
                email: data.email,
                password: hashedPassword,
                birthDate: data.birthDate
            },
            select: {
                id: true,
                name: true,
                email: true,
                birthDate: true,
                password: false
            }
        }); 
            
    }

    async findAll(){
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                birthDate: true,
                password: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return users
    }

    async findById(id: number) {
        const user = await prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                email: true,
                birthDate: true,
                password: false
            }
        });

        if(!user){
            throw new Error('Usuário não encontrado')
        }

        return user
    }

    async update(id: number, data: {
        name?: string
        email?: string
        birthDate?: Date
        password?: string
    }) {
        if (data.password) {
            const hashedPassword = await hash(data.password, 10)
            data.password = hashedPassword
        }
        const user = await prisma.user.update({
            where: {id},
            data
        })

        return user
    }
    async delete(id: number) {
        const user = await prisma.user.delete({
            where: {id}
        })

        return user
    }
}