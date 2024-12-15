import { ApiResponseBuilder } from '@/utils/response';
import { errorHandler } from '@/middleware/error-handler';
import { ProductService } from './product.service';

export class ProductController {
	static async GET() {
		try {
			const products = await ProductService.GET();

			return ApiResponseBuilder.created(products, {
				message: 'products retrieved successfully',
			});
		} catch (error) {
			return errorHandler(error);
		}
	}
}
