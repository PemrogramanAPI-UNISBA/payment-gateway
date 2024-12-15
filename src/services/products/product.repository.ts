import { prisma } from '@/lib/prisma';

export class ProductRepository {
	static async getAllData(): Promise<ReturnType<typeof prisma.product.findMany>> {
		const products = await prisma.product.findMany();

		return products;
	}
}
