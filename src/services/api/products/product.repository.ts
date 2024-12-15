import { prisma } from '@/lib/prisma';

export class ProductRepository {
	static async getAllData(): Promise<ReturnType<typeof prisma.product.findMany>> {
		const products = await prisma.product.findMany();

		return products;
	}

	static async getByID(productID: string): Promise<ReturnType<typeof prisma.product.findUnique>> {
		const product = await prisma.product.findUnique({
			where: {
				id: productID,
			},
		});

		return product;
	}
}
