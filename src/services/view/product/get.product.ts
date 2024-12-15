import axios from 'axios';

export class GetProduct {
	static async getAll() {
		const response = await axios.get('/api/products');
		return response.data;
	}
}
