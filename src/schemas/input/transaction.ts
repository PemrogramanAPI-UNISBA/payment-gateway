import { z } from 'zod';

export const PaymentSchema = z.object({
	productId: z.string(),
	amount: z.number().positive(),
	customerName: z.string(),
	customerEmail: z.string().email(),
});

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;
