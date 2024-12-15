import axios, { AxiosResponse } from 'axios';
import { PaymentRequest } from '@/types/payment';
import { CustomError } from '@/utils/error';

export class PostPayment {
	static async createPayment(data: PaymentRequest) {
		try {
			const response: AxiosResponse = await axios.post('/api/payment', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.response);
				if (error.response) {
					throw new CustomError(error.response.data.message || 'Gagal memproses pembayaran', error.response.status || 500);
				}
				throw error;
			}
		}
	}
}
