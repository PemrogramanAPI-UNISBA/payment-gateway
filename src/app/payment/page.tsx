'use client';

import React, { useEffect, useState } from 'react';

interface Product {
	id: string;
	name: string;
	price: number;
}

export default function PaymentPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
	const [customerName, setCustomerName] = useState<string>('');
	const [customerEmail, setCustomerEmail] = useState<string>('');
	const [productPrice, setProductPrice] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch('/api/products');
				const data = await response.json();
				setProducts(data.data);
			} catch (error) {
				console.error('Error fetching products:', error);
			}
		};

		fetchProducts();
	}, []);

	useEffect(() => {
		if (selectedProductId) {
			const selectedProduct = products.find((product) => product.id === selectedProductId);
			setProductPrice(selectedProduct ? selectedProduct.price : null);
		}

		console.log(selectedProductId);
	}, [selectedProductId, products]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const paymentData = {
			productId: selectedProductId,
			customerName,
			customerEmail,
			amount: productPrice,
		};

		console.log(paymentData);
		try {
			const response = await fetch('/api/payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(paymentData),
			});

			if (!response.ok) {
				throw new Error('Failed to process payment');
			}

			alert('Payment successful!');
			// Reset form setelah sukses
			setSelectedProductId(null);
			setCustomerName('');
			setCustomerEmail('');
			setProductPrice(null);
		} catch (error) {
			console.error('Error submitting payment:', error);
			alert('Payment failed. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-4'>Payment Page</h1>

			{/* Form pembayaran */}
			<form
				onSubmit={handleSubmit}
				className='p-6 rounded-md shadow-md'
			>
				<h2 className='text-xl font-semibold mb-4'>Payment Form</h2>

				{/* Pilih produk */}
				<div className='mb-4'>
					<label
						htmlFor='product'
						className='block font-medium mb-2'
					>
						Select Product
					</label>
					<select
						id='product'
						value={selectedProductId || ''}
						onChange={(e) => setSelectedProductId(e.target.value)}
						className='w-full p-2 border rounded text-slate-800'
						required
					>
						<option
							value=''
							disabled
						>
							Select a product
						</option>
						{products.map((product) => (
							<option
								key={product.id}
								value={product.id}
							>
								{product.name} - Rp {product.price.toLocaleString()}
							</option>
						))}
					</select>
				</div>

				{/* Input nama customer */}
				<div className='mb-4'>
					<label
						htmlFor='customerName'
						className='block font-medium mb-2'
					>
						Customer Name
					</label>
					<input
						id='customerName'
						type='text'
						value={customerName}
						onChange={(e) => setCustomerName(e.target.value)}
						className='w-full p-2 border rounded  text-slate-800'
						placeholder='Enter customer name'
						required
					/>
				</div>

				{/* Input email customer */}
				<div className='mb-4'>
					<label
						htmlFor='customerEmail'
						className='block font-medium mb-2'
					>
						Customer Email
					</label>
					<input
						id='customerEmail'
						type='email'
						value={customerEmail}
						onChange={(e) => setCustomerEmail(e.target.value)}
						className='w-full p-2 border rounded  text-slate-800'
						placeholder='Enter customer email'
						required
					/>
				</div>

				{/* Input harga produk (otomatis terisi) */}
				<div className='mb-4'>
					<label
						htmlFor='productPrice'
						className='block font-medium mb-2'
					>
						Product Price (Rp)
					</label>
					<input
						id='productPrice'
						type='text'
						value={productPrice !== null ? productPrice.toLocaleString() : ''}
						readOnly
						className='w-full p-2 border rounded bg-gray-100  text-slate-800'
					/>
				</div>

				<button
					type='submit'
					disabled={isSubmitting}
					className='bg-blue-500 text-white p-2 rounded w-full'
				>
					{isSubmitting ? 'Processing...' : 'Submit Payment'}
				</button>
			</form>
		</div>
	);
}
