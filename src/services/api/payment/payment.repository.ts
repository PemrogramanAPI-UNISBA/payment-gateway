import { prisma } from '@/lib/prisma';
import { PaymentDataType } from './payment.type';

export class PaymentRepository {
	static async CREATE(paymentData: PaymentDataType) {
		console.log(paymentData);
		console.log(paymentData);
		const payment = await prisma.transaction.create({
			data: {
				amount: paymentData.amount,
				snapToken: paymentData.snapToken,
				Customer: {
					create: {
						name: paymentData.customerName,
					},
				},
			},
		});
		return payment;
	}
}
