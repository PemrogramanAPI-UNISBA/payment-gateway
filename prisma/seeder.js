import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const products = [
		{ name: 'Laptop Gaming', price: 15000000 },
		{ name: 'Smartphone Flagship', price: 12000000 },
		{ name: 'Tablet Pro', price: 8000000 },
		{ name: 'Headphone Wireless', price: 2000000 },
		{ name: 'Smartwatch', price: 2500000 },
	];

	console.log('Seeding Products...');
	await prisma.product.createMany({
		data: products,
	});

	const customers = [{ name: 'John Doe' }, { name: 'Jane Smith' }, { name: 'Alice Johnson' }, { name: 'Bob Brown' }, { name: 'Charlie Davis' }];

	console.log('Seeding Customers...');
	await prisma.customer.createMany({
		data: customers,
	});
}

main()
	.then(() => {
		console.log('Seeding selesai!');
	})
	.catch((e) => {
		console.error('Terjadi kesalahan saat seeding:', e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
