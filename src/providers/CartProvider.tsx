'use client';
import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { type CartItem, type UserType } from '@/types';

interface CartContextType {
	cart: CartItem[];
	addToCart: (slug: string) => Promise<void>;
	removeFromCart: (slug: string) => Promise<void>;
	getCart: () => CartItem[];
	isInCart: (slug: string) => boolean;
	toggleCartItem: (slug: string) => Promise<void>;
	mergeLocalAndDatabaseCarts: (user: UserType) => Promise<void>;
	clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>([]);

	useEffect(() => {
		const storedCart = localStorage.getItem('cart');
		if (storedCart) {
			setCart(JSON.parse(storedCart));
		}
	}, []);

	const updateLocalStorage = (newCart: CartItem[]) => {
		localStorage.setItem('cart', JSON.stringify(newCart));
	};

	const clearCart = () => {
		setCart([]);
		updateLocalStorage([]);
	};

	const addToCart = async (slug: string) => {
		setCart((prevCart) => {
			const existingItem = prevCart.find((item) => item.slug === slug);
			if (existingItem) {
				const newCart = prevCart.map((item) =>
					item.slug === slug ? { ...item, removed: false } : item
				);
				updateLocalStorage(newCart);
				return newCart;
			} else {
				const newCart = [...prevCart, { slug, removed: false }];
				updateLocalStorage(newCart);
				return newCart;
			}
		});
	};

	const removeFromCart = async (slug: string) => {
		setCart((prevCart) => {
			const newCart = prevCart.map((item) =>
				item.slug === slug ? { ...item, removed: true } : item
			);
			updateLocalStorage(newCart);
			return newCart;
		});
	};

	const getCart = () => cart;

	const isInCart = (slug: string): boolean => {
		return cart.some((item) => item.slug === slug && !item.removed);
	};

	const toggleCartItem = async (slug: string) => {
		setCart((prevCart) => {
			const existingItem = prevCart.find((item) => item.slug === slug);
			let newCart;
			if (existingItem) {
				newCart = prevCart.map((item) =>
					item.slug === slug ? { ...item, removed: !item.removed } : item
				);
			} else {
				newCart = [...prevCart, { slug, removed: false }];
			}
			updateLocalStorage(newCart);
			return newCart;
		});
	};

	const mergeLocalAndDatabaseCarts = async (user: UserType) => {
		const localCart = getCart();
		const mergedCart = [...user.cart];

		for (const localItem of localCart) {
			if (!mergedCart.some((item) => item.slug === localItem.slug)) {
				mergedCart.push(localItem);
			}
		}

		setCart(mergedCart);
		updateLocalStorage(mergedCart);

		try {
			const response = await fetch('/api/user/sync-cart', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ cart: mergedCart }),
			});

			if (!response.ok) {
				console.error('Failed to sync cart with backend');
			}
		} catch (error) {
			console.error('Error syncing cart with backend:', error);
		}
	};

	const contextValue: CartContextType = {
		cart,
		addToCart,
		removeFromCart,
		getCart,
		isInCart,
		toggleCartItem,
		mergeLocalAndDatabaseCarts,
		clearCart,
	};

	return (
		<CartContext.Provider value={contextValue}>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error('useCartContext must be used within a CartProvider');
	}
	return context;
}
