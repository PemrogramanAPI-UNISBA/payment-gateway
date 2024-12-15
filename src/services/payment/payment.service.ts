import { NextRequest } from 'next/server';

export class PaymentService {
	static async GET(request: NextRequest): Promise<string | null> {
		try {
			const searchParams = request.nextUrl.searchParams;
			const query = searchParams.get('query');
			return query;
		} catch (error) {
			console.error('Error in GET method:', error);
			return null;
		}
	}

	static async CREATE<T extends Record<string, unknown>>(request: T): Promise<T> {
		try {
			console.log('CREATE request data:', request);
			return request;
		} catch (error) {
			console.error('Error in CREATE method:', error);
			throw new Error('CREATE method failed');
		}
	}
}
