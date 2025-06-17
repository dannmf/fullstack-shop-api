import { prisma } from "../../shared/lib/prisma";
import { ProductDto } from "./product_dto";

export class ProductsService {
    async createProduct(data: {

        name: string;
        description: string;
        price: number;
        stock: number;
        categoryId: number;
        imageUrl: string;
    }) {
        const existingProduct = await prisma.product.findUnique({
            where: {
                name: data.name
            }
        })

        if(existingProduct){
            throw new Error('Produto já cadastrado')
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                categoryId: data.categoryId,
                imageUrl: data.imageUrl
            },

            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                category: true,
                imageUrl: true
            },
        })

        return new ProductDto(product)
    }

    async findAll(){
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                category: true,
                imageUrl: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return products.map(product => new ProductDto(product));
    }

    async findById(id: number) {
        const product =  await prisma.product.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                category: true,
                imageUrl: true
            }
        })

        if(!product){
            throw new Error('Produto não encontrado')
        }

        return new ProductDto(product)
    }

    async countProducts(){
        const count = await prisma.product.count()
        return count
    }

    async lowStockProducts(){
        const products = await prisma.product.findMany({
            where: {
                stock: {
                    lte: 5
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                category: true,
                imageUrl: true
            }
        })

        return products.map(products => new ProductDto(products));
    }

    async update(id:number, data:{
        name?: string
        description?: string
        price?: number
        stock?: number
        categoryId?: number
        imageUrl?: string
    }){
        const productId = await prisma.product.findUnique({
            where: {id}
        })

        if(!productId){
            throw new Error('Produto não encontrado')
        }
        
        const product = prisma.product.update({
            where: {id},
            data:{
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                categoryId: data.categoryId,
                imageUrl: data.imageUrl
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                category: true,
                imageUrl: true
            }
        })

        return new ProductDto(product)

    }

    async delete(id: number){
        const product = await prisma.product.delete({
            where: {id}
        })

        return new ProductDto(product)
    }

}