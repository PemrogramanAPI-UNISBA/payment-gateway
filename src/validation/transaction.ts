import { z } from 'zod';

export const PaymentSchema = z.object({
	productId: z.string().nonempty('Pilih produk yang akan dibayar'),
	amount: z.number().positive('lu kira gratis cuy?'),
	customerName: z.string().nonempty('nama pelanggan tidak boleh kosong'),
	customerEmail: z.string().email(),
});

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;
