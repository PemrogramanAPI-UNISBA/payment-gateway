import { PaymentSchema } from '@/schemas/input/transaction';
import { ApiResponseBuilder } from '@/utils/response';
import { validateSchema } from '@/utils/validation';
import { NextRequest } from 'next/server';
import { PaymentService } from './payment.service';
import { errorHandler } from '@/middleware/error-handler';

export class PaymentController {
	static async GET(request: NextRequest) {
		try {
			const searchParams = request.nextUrl.searchParams;
			const query = searchParams.get('query');
			console.log(query);

			return ApiResponseBuilder.created(query, {
				message: 'transaction retrieved successfully',
			});
		} catch (error) {
			return errorHandler(error);
		}
	}

	static async POST(request: Request) {
		try {
			const requestBody = await request.json();
			const data = validateSchema(PaymentSchema, requestBody);

			const createPayment = await PaymentService.CREATE(data);

			return ApiResponseBuilder.created(createPayment, {
				message: 'transaction created successfully',
			});
		} catch (error) {
			return errorHandler(error);
		}
	}
}
