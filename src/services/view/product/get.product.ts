import axios from 'axios';

export class GetProduct {
	static async getAll() {
		const data = await axios.get('/api/products');
		return data;
	}
}
