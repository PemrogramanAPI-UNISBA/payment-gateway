export type PaymentDataType = {
	productId: string;
	amount: number;
	customerName: string;
	customerEmail: string;
	snapToken?: string;
};

export type PaymentWithTransactionData = PaymentDataType & {
	id: string;
	orderId: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
};
