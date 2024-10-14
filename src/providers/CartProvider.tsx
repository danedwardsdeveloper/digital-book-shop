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
	mergeCartsOnLogin: (user: UserType) => Promise<void>;
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

	const mergeCartsOnLogin = async (user: UserType) => {
		const localCart = getCart();
		for (const item of localCart) {
			if (!user.cart.some((cartItem) => cartItem.slug === item.slug)) {
				await addToCart(item.slug);
			}
		}
		setCart([]);
		updateLocalStorage([]);
	};

	const contextValue: CartContextType = {
		cart,
		addToCart,
		removeFromCart,
		getCart,
		isInCart,
		toggleCartItem,
		mergeCartsOnLogin,
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
