import { prisma } from "../../shared/lib/prisma";

export class CategoryService {
    async createCategory(data: {
        name: string
    }) {
        const existingCategory = await prisma.category.findUnique({
            where: {
                name: data.name
            }
        })

        if (existingCategory) {
            throw new Error('Categoria já cadastrada')
        }

        return prisma.category.create({
            data: {
                name: data.name
            },
            select: {
                id: true,
                name: true
            }
        });
    }

    async findAll() {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                createdAt: true,
            },

            orderBy: {
                createdAt: 'desc'
            }

        })
        return categories
    }

    async findById(id: number) {
        const category = await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                createdAt: true
            }

        })
        return category
    }

    async update(id: number, data: {
        name: string
    }) {
        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name
            },
            select: {
                id: true,
                name: true,
                createdAt: true
            }
        })
        return category
    }
    async delete(id: number) {
        const category = await prisma.category.delete({
            where: { id },
        })

        return category
    }
}