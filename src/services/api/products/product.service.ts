import { Product } from '@prisma/client';
import { ProductRepository } from './product.repository';

export class ProductService {
	static async GET(): Promise<Product[]> {
		try {
			const products = await ProductRepository.getAllData();
			return products;
		} catch (error) {
			console.error('Error in GET method:', error);
			throw new Error('Failed to fetch product data');
		}
	}
}
