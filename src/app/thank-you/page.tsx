'use client';
import { useEffect } from 'react';
import { useCart } from '@/providers/CartProvider';

export default function ThankYou() {
	const { clearCart } = useCart();

	useEffect(() => {
		clearCart();
	}, []);

	return <div>Success. Thank you for your purchase.</div>;
}
