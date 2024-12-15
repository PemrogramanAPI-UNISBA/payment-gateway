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

	static async WEBHOOK<T>(dataNotification: T) {
		console.log(dataNotification);

		/*
		* Contoh data Notification // dikirim otomatis oleh midtrans ke endpoint webhook di API [POST]
		{
			"va_numbers": [
				{
				"va_number": "9880475897224761",
				"bank": "bni"
				}
			],
			"transaction_time": "2024-12-14 02:35:26",
			"transaction_status": "cancel",
			"transaction_id": "c28e7aff-6317-4538-8bbf-612933a908bf",
			"status_message": "midtrans payment notification",
			"status_code": "202",
			"signature_key": "44008e99621830e6a1e179f2c11c2c0e1370c7e3cd1e847fd08ec21afcb75302ca5b6d4114180c389d89235b315377bb360fefa8344ee5625d7d5e69a40003a8",
			"payment_type": "bank_transfer",
			"payment_amounts": [],
			"order_id": "c9c1cdeb-9357-4025-8330-8497a7b9838a",
			"merchant_id": "G600704758",
			"gross_amount": "9270.00",
			"fraud_status": "accept",
			"expiry_time": "2024-12-15 02:35:26",
			"currency": "IDR"
		}
		*/

		/*
		TODO: 1. search data by orderID
		? dataNotification.order_id == database.table.order_id

		TODO: 2. midtrans notification
		? const paymentData = await snap.transaction.notification(dataNotification);

		TODO: 3. do update
		? if paymentData.transaction_status == 'capture' && fraud_status == 'accept'
		? if paymentData.transaction_status == 'settlement'
		? if paymentData.transaction_status == 'pending'
		? if paymentData.transaction_status == 'cancel | expire | deny'

		? apa saja yang di update?
		1. status transaksi di database
		2. kondisi lain (contoh: stok barang, status barang, status pembelian)
		*/
	}

	static async CANCEL(orderId: string) {
		console.log(orderId);
		/*
		TODO: 1. find by order ID

		TODO: 2. jika valid, lakukan pembatalan transaksi

		const encodedServerKey = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

		const url = `https://api.sandbox.midtrans.com/v2/${orderId}/cancel`;
		const options = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			authorization: `Basic ${encodedServerKey}`,
		},
		};

		const response = await fetch(url, options);
		const transaction = await response.json();

		console.log('response cancel');

		TODO: 3. lakukan update jika pembatalan sudah berhasil
		? apa saja yang di update?
		1. status transaksi di database
		2. kondisi lain (contoh: stok barang, status barang, status pembelian)
		*/
	}
}
