'use client';
import { CartItem } from '@/types';
import { SubmitButton } from './Buttons';
import { useApiContext } from './Providers';
import { useState } from 'react';

export function CartButton({ slug }: CartItem) {
	const { user, updateApiResponse } = useApiContext();
	const [isLoading, setIsLoading] = useState(false);
	const inCart = user?.cart.some((book) => book.slug === slug) ?? false;

	const handleAddToCart = async () => {
		if (inCart) return;

		setIsLoading(true);
		try {
			const response = await fetch(`/api/cart/add/${slug}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();

			if (data.status === 'success' || data.status === 'info') {
				updateApiResponse({
					message: data.message,
					status: data.status,
					user: data.user,
				});
			} else {
				throw new Error(data.message || 'Failed to add item to cart');
			}
		} catch (error) {
			console.error('Error adding item to cart:', error);
			updateApiResponse({
				message: 'Failed to add item to cart',
				status: 'error',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SubmitButton
			classes={'my-8'}
			cta={inCart ? 'In cart' : isLoading ? 'Adding...' : 'Add to cart'}
			onClick={handleAddToCart}
			disabled={inCart || isLoading}
		/>
	);
}
