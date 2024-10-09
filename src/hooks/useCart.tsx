import { useState, useEffect } from 'react';
import { ApiStatus, CartItem, UserType } from '@/types';
import { useApiContext } from '@/components/Providers';

export function useCart() {
	const { user, updateApiResponse } = useApiContext();
	const [localCart, setLocalCart] = useState<CartItem[]>([]);
	const [removedItems, setRemovedItems] = useState<string[]>([]);

	useEffect(() => {
		const storedCart = localStorage.getItem('cart');
		if (storedCart) {
			setLocalCart(JSON.parse(storedCart));
		}

		const storedRemovedItems = localStorage.getItem('removedItems');
		if (storedRemovedItems) {
			setRemovedItems(JSON.parse(storedRemovedItems));
		}
	}, []);

	const updateLocalCart = (newCart: CartItem[]) => {
		setLocalCart(newCart);
		localStorage.setItem('cart', JSON.stringify(newCart));
	};

	const updateRemovedItems = (newRemovedItems: string[]) => {
		setRemovedItems(newRemovedItems);
		localStorage.setItem('removedItems', JSON.stringify(newRemovedItems));
	};

	const addToCart = async (slug: string) => {
		if (user) {
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
						status: data.status as ApiStatus,
						user: data.user,
					});

					const newRemovedItems = removedItems.filter(
						(item) => item !== slug
					);
					updateRemovedItems(newRemovedItems);
				} else {
					throw new Error(data.message || 'Failed to add item to cart');
				}
			} catch (error) {
				console.error('Error adding item to cart:', error);
				updateApiResponse({
					message: 'Failed to add item to cart',
					status: 'error',
				});
			}
		} else {
			const newCart = [...localCart, { slug }];
			updateLocalCart(newCart);

			const newRemovedItems = removedItems.filter((item) => item !== slug);
			updateRemovedItems(newRemovedItems);
		}
	};

	const removeFromCart = async (slug: string) => {
		if (user) {
			try {
				const response = await fetch(`/api/cart/remove/${slug}`, {
					method: 'DELETE',
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

					const newRemovedItems = [...removedItems, slug];
					updateRemovedItems(newRemovedItems);
				} else {
					throw new Error(
						data.message || 'Failed to remove item from cart'
					);
				}
			} catch (error) {
				console.error('Error removing item from cart:', error);
				updateApiResponse({
					message: 'Failed to remove item from cart',
					status: 'error',
				});
			}
		} else {
			const newCart = localCart.filter((item) => item.slug !== slug);
			updateLocalCart(newCart);

			const newRemovedItems = [...removedItems, slug];
			updateRemovedItems(newRemovedItems);
		}
	};

	const getCart = (): CartItem[] => {
		return user ? user.cart : localCart;
	};

	const isInCart = (slug: string): boolean => {
		return getCart().some((item) => item.slug === slug);
	};

	const isRemoved = (slug: string): boolean => {
		return removedItems.includes(slug);
	};

	const mergeCartsOnLogin = (user: UserType) => {
		localCart.forEach(async (item) => {
			if (!user.cart.some((cartItem) => cartItem.slug === item.slug)) {
				await addToCart(item.slug);
			}
		});
		updateLocalCart([]);
		updateRemovedItems([]);
	};

	return {
		addToCart,
		removeFromCart,
		getCart,
		isInCart,
		isRemoved,
		mergeCartsOnLogin,
	};
}
