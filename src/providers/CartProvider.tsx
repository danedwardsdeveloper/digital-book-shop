'use client';
import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { MongoCartItem, type CartItem, type UserType } from '@/types';

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
			const parsedCart = JSON.parse(storedCart);
			setCart(parsedCart.map(cleanCartItem));
		}
	}, []);

	const cleanCartItem = (item: MongoCartItem): CartItem => {
		return {
			slug: item.slug,
			removed: item.removed ?? false,
		};
	};

	const updateLocalStorage = (newCart: CartItem[]) => {
		const cleanCart = newCart.map(cleanCartItem);
		localStorage.setItem('cart', JSON.stringify(cleanCart));
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
		const databaseCart = user.cart.map(cleanCartItem);

		const mergedItemsMap = new Map<string, CartItem>();

		databaseCart.forEach((item) => {
			mergedItemsMap.set(item.slug, { ...item });
		});

		localCart.forEach((localItem) => {
			const existingItem = mergedItemsMap.get(localItem.slug);
			if (existingItem) {
				mergedItemsMap.set(localItem.slug, {
					slug: localItem.slug,
					removed: existingItem.removed && localItem.removed,
				});
			} else {
				mergedItemsMap.set(localItem.slug, { ...localItem });
			}
		});

		const mergedCart = Array.from(mergedItemsMap.values());

		setCart(mergedCart);
		updateLocalStorage(mergedCart);

		try {
			const response = await fetch('/api/cart/sync', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ cart: mergedCart }),
			});

			if (!response.ok) {
				console.error(
					'Failed to sync cart with database:',
					response.status
				);
			}
		} catch (error) {
			console.error('Failed to sync cart with database:', error);
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
