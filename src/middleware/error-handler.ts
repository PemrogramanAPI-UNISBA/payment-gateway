import { CustomError } from '@/utils/error';
import { ApiResponseBuilder } from '@/utils/response';
import { z } from 'zod';

export function errorHandler(error: unknown) {
	const NODE_ENV = process.env.NODE_ENV || 'development';
	const isDevelopment = NODE_ENV === 'development' ? true : false;

	if (isDevelopment) {
		console.log('\x1b[31m%s\x1b[0m', '=============== ERROR ==============');
		console.log(Date());
		console.log('\x1b[31m%s\x1b[0m', '====================================');
		console.log(`${error || 'something error'}`);
		console.log('\x1b[31m%s\x1b[0m', '====================================');
	}

	if (error instanceof CustomError) {
		return ApiResponseBuilder.error(error.message, error.statusCode, error.stack);
	}

	if (error instanceof z.ZodError) {
		return ApiResponseBuilder.error('Validation error', 400, error.errors);
	}

	return ApiResponseBuilder.error('Something went wrong', 500);
}
