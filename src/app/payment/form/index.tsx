'use client';

import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { GetProduct } from '@/services/view/product';
import { PostPayment } from '@/services/view/payment';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentSchema, PaymentSchemaType } from '@/validation/transaction';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';

interface Product {
	id: string;
	name: string;
	price: number;
}

export default function PaymentForm() {
	const router = useRouter();

	const {
		handleSubmit,
		register,
		setValue,
		control,
		formState: { errors, isSubmitting },
	} = useForm<PaymentSchemaType>({
		resolver: zodResolver(PaymentSchema),
		defaultValues: { productId: '', amount: 0 },
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
		},
		onError: (error) => {
			console.error('Error pembayaran:', error);
			alert('Pembayaran gagal. Silakan coba lagi.');
		},
	});

	const selectedProductId = useWatch({ control, name: 'productId' });

	useEffect(() => {
		if (selectedProductId && products?.data) {
			const selectedProduct = products.data.find((p) => p.id === selectedProductId);
			if (selectedProduct) {
				setValue('amount', selectedProduct.price);
			}
		}
	}, [selectedProductId, products, setValue]);

	const onSubmitForm: SubmitHandler<PaymentSchemaType> = async (data) => {
		paymentMutation.mutate({
			productId: data.productId!,
			customerName: data.customerName,
			customerEmail: data.customerEmail,
			amount: data.amount!,
		});
	};

	if (isLoadingProducts) {
		return <div>Memuat produk...</div>;
	}

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-4'>Halaman Pembayaran</h1>
			<form
				onSubmit={handleSubmit(onSubmitForm)}
				className='p-6 rounded-md shadow-md'
			>
				<h2 className='text-xl font-semibold mb-4'>Form Pembayaran</h2>

				<div className='mb-4'>
					<label
						htmlFor='product'
						className='block font-medium mb-2'
					>
						Pilih Produk
					</label>
					<select
						{...register('productId')}
						className='w-full p-2 border rounded text-slate-800'
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
					<p className='text-red-600'>{errors.productId && errors.productId.message}</p>
				</div>

				<div className='mb-4'>
					<label
						htmlFor='customerName'
						className='block font-medium mb-2'
					>
						Nama Pelanggan
					</label>
					<input
						type='text'
						{...register('customerName')}
						className='w-full p-2 border rounded text-slate-800'
						placeholder='Masukkan nama pelanggan'
					/>
					<p className='text-red-600'>{errors.customerName && errors.customerName.message}</p>
				</div>

				<div className='mb-4'>
					<label
						htmlFor='customerEmail'
						className='block font-medium mb-2'
					>
						Email Pelanggan
					</label>
					<input
						type='email'
						{...register('customerEmail')}
						className='w-full p-2 border rounded text-slate-800'
						placeholder='Masukkan email pelanggan'
					/>
					<p className='text-red-600'>{errors.customerEmail && errors.customerEmail.message}</p>
				</div>

				<div className='mb-4'>
					<label
						htmlFor='amount'
						className='block font-medium mb-2'
					>
						Harga Produk (Rp)
					</label>
					<input
						id='amount'
						type='text'
						{...register('amount')}
						readOnly
						className='w-full p-2 border rounded bg-gray-100 text-slate-800'
					/>
					<p className='text-red-600'>{errors.amount && errors.amount.message}</p>
				</div>

				<button
					type='submit'
					disabled={isSubmitting || paymentMutation.isPending}
					className='bg-blue-500 text-white p-2 rounded w-full'
				>
					{isSubmitting || paymentMutation.isPending ? 'Memproses...' : 'Bayar Sekarang'}
				</button>
			</form>
		</div>
	);
}
