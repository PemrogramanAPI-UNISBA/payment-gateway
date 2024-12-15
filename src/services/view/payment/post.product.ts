import axios, { AxiosResponse } from 'axios';
import { PaymentRequest } from '@/types/payment';

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
				if (error.response) {
					throw new Error(error.response.data.message || 'Gagal memproses pembayaran');
				} else if (error.request) {
					throw new Error('Tidak ada respon dari server');
				} else {
					throw new Error('Gagal membuat request pembayaran');
				}
			}
			throw error;
		}
	}
}
