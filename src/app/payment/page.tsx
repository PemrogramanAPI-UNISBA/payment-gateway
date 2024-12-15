import { Metadata } from 'next';
import PaymentForm from './form';

export const metadata: Metadata = {
	title: 'Payment | Pemrograman API',
	description: 'Pemrograman API - Payment Gateway',
};

export default function PaymentPage() {
	return (
		<>
			<PaymentForm />
		</>
	);
}
