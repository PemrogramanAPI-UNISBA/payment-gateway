import { z } from 'zod';

export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
	try {
		const validatedData = schema.parse(data);
		return validatedData;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw error;
		}
		throw new Error('Unknown error during schema validation');
	}
};
