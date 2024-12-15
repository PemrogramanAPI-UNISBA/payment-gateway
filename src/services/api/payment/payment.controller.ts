import { PaymentSchema } from '@/validation/transaction';
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

			return ApiResponseBuilder.success(query, {
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

	static async WEBHOOK(request: Request) {
		try {
			console.log('webhook');
			//! dokumentasi midtrans: https://docs.midtrans.com/docs/https-notification-webhooks
			const data = await request.json(); // data dikirim otomatis oleh midtrans

			/*
			TODO: set notifikasi midtrans
			https://dashboard.sandbox.midtrans.com/settings/payment/notification
			*/

			const realtimeUpdate = await PaymentService.WEBHOOK(data);

			return ApiResponseBuilder.success(realtimeUpdate, {
				message: 'OK',
			});
		} catch (error) {
			return errorHandler(error);
		}
	}

	static async CANCEL(request: Request) {
		try {
			console.log('cancel');
			//! dokumentasi midtrans: https://docs.midtrans.com/reference/cancel-transaction
			const data = await request.json(); // kirim data orderId dari body

			const cancelTransaction = await PaymentService.CANCEL(data.orderId);

			return ApiResponseBuilder.success(cancelTransaction, {
				message: 'transaction canceled successfully',
			});
		} catch (error) {
			return errorHandler(error);
		}
	}
}
