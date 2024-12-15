import { NextRequest } from 'next/server';
import { PaymentRepository } from './payment.repository';
import { PaymentDataType } from './payment.type';
import { snap } from '@/lib/midtrans';
import { ProductRepository } from '../products/product.repository';
import { CustomError } from '@/utils/error';

export class PaymentService {
	static async GET(request: NextRequest): Promise<string | null> {
		const searchParams = request.nextUrl.searchParams;
		const query = searchParams.get('query');
		return query;
	}

	static async CREATE<T extends PaymentDataType>(request: T) {
		const product = await ProductRepository.getByID(request.productId);

		if (!product) {
			throw new CustomError('product is not found', 400);
		}

		console.log('product');
		console.log(product);

		const parameter = {
			transaction_details: {
				gross_amount: request.amount,
				order_id: crypto.randomUUID(),
			},
			item_details: {
				id: crypto.randomUUID(),
				price: request.amount,
				name: product?.name,
				quantity: 1,
			},
			customer_details: {
				first_name: request.customerName,
				email: request.customerEmail,
			},
		};

		// create snap token
		const snapPayment = await snap.createTransaction(parameter);

		const paymentData = {
			...request,
			snapToken: snapPayment.token,
		};

		// insert into database
		const payment = await PaymentRepository.CREATE(paymentData);

		const response = {
			...payment,
			redirect_url: snapPayment.redirect_url,
		};

		return response;
	}
}
