'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { GetProduct } from '@/services/view/product';
import { PostPayment } from '@/services/view/payment/post.product';

interface Product {
	id: string;
	name: string;
	price: number;
}

interface PaymentData {
	productId: string | null;
	customerName: string;
	customerEmail: string;
	amount: number | null;
}

export default function PaymentPage() {
	const router = useRouter();

	const [formData, setFormData] = useState<Omit<PaymentData, 'amount'> & { amount?: number | null }>({
		productId: null,
		customerName: '',
		customerEmail: '',
		amount: null,
	});

	const { data: products, isLoading: isLoadingProducts } = useQuery<{ data: Product[] }>({
		queryKey: ['products'],
		queryFn: GetProduct.getAll,
	});

	const paymentMutation = useMutation({
		mutationFn: PostPayment.createPayment,
		onSuccess: (data) => {
			alert('Pembayaran berhasil');
			router.push(data.data.redirect_url);

			setFormData({
				productId: null,
				customerName: '',
				customerEmail: '',
				amount: null,
			});
		},
		onError: (error) => {
			console.error('Error pembayaran:', error);
			alert('Pembayaran gagal. Silakan coba lagi.');
		},
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { id, value } = e.target;

		if (id === 'product') {
			const selectedProduct = products?.data?.find((p) => p.id === value);
			setFormData((prev) => ({
				...prev,
				productId: value,
				amount: selectedProduct?.price || null,
			}));
			return;
		}

		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.productId || !formData.customerName || !formData.customerEmail) {
			alert('Silakan lengkapi semua field');
			return;
		}

		paymentMutation.mutate({
			productId: formData.productId!,
			customerName: formData.customerName,
			customerEmail: formData.customerEmail,
			amount: formData.amount!,
		});
	};

	if (isLoadingProducts) {
		return <div>Memuat produk...</div>;
	}

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-4'>Halaman Pembayaran</h1>

			<form
				onSubmit={handleSubmit}
				className='p-6 rounded-md shadow-md'
			>
				<h2 className='text-xl font-semibold mb-4'>Form Pembayaran</h2>

				{/* Select Produk */}
				<div className='mb-4'>
					<label
						htmlFor='product'
						className='block font-medium mb-2'
					>
						Pilih Produk
					</label>
					<select
						id='product'
						value={formData.productId || ''}
						onChange={handleInputChange}
						className='w-full p-2 border rounded text-slate-800'
						required
					>
						<option
							value=''
							disabled
						>
							Pilih Produk
						</option>
						{products?.data?.map((product) => (
							<option
								key={product.id}
								value={product.id}
							>
								{product.name} - Rp {product.price.toLocaleString()}
							</option>
						))}
					</select>
				</div>

				{/* Input Nama */}
				<div className='mb-4'>
					<label
						htmlFor='customerName'
						className='block font-medium mb-2'
					>
						Nama Pelanggan
					</label>
					<input
						id='customerName'
						type='text'
						value={formData.customerName}
						onChange={handleInputChange}
						className='w-full p-2 border rounded text-slate-800'
						placeholder='Masukkan nama pelanggan'
						required
					/>
				</div>

				{/* Input Email */}
				<div className='mb-4'>
					<label
						htmlFor='customerEmail'
						className='block font-medium mb-2'
					>
						Email Pelanggan
					</label>
					<input
						id='customerEmail'
						type='email'
						value={formData.customerEmail}
						onChange={handleInputChange}
						className='w-full p-2 border rounded text-slate-800'
						placeholder='Masukkan email pelanggan'
						required
					/>
				</div>

				{/* Harga Produk */}
				<div className='mb-4'>
					<label
						htmlFor='productPrice'
						className='block font-medium mb-2'
					>
						Harga Produk (Rp)
					</label>
					<input
						id='productPrice'
						type='text'
						value={formData.amount !== null ? formData.amount!.toLocaleString() : ''}
						readOnly
						className='w-full p-2 border rounded bg-gray-100 text-slate-800'
					/>
				</div>

				<button
					type='submit'
					disabled={paymentMutation.isPending}
					className='bg-blue-500 text-white p-2 rounded w-full'
				>
					{paymentMutation.isPending ? 'Memproses...' : 'Bayar Sekarang'}
				</button>
			</form>
		</div>
	);
}
