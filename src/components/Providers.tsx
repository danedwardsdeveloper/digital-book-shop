'use client';
import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { type ApiResponse, type CartItem, type UserType } from '@/types';

interface ApiContextType extends ApiResponse {
	updateApiResponse: (newApiResponse: Partial<ApiResponse>) => void;
	cart: CartItem[];
	addToCart: (slug: string) => Promise<void>;
	removeFromCart: (slug: string) => Promise<void>;
	getCart: () => CartItem[];
	isInCart: (slug: string) => boolean;
	mergeCartsOnLogin: (user: UserType) => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
	const [apiResponse, setApiResponse] = useState<ApiResponse>({
		message: null,
		status: 'info',
		signedIn: false,
		user: null,
	});
	const [cart, setCart] = useState<CartItem[]>([]);

	useEffect(() => {
		const storedCart = localStorage.getItem('cart');
		if (storedCart) {
			setCart(JSON.parse(storedCart));
		}
	}, []);

	const updateApiResponse = (newApiResponse: Partial<ApiResponse>) => {
		setApiResponse((prevState) => ({ ...prevState, ...newApiResponse }));
	};

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

	const contextValue: ApiContextType = {
		...apiResponse,
		updateApiResponse,
		cart,
		addToCart,
		removeFromCart,
		getCart,
		isInCart,
		mergeCartsOnLogin,
	};

	return (
		<ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
	);
}

export function useApiContext() {
	const context = useContext(ApiContext);
	if (context === undefined) {
		throw new Error(
			'useApiContext must be used within a Providers component'
		);
	}
	return context;
}

export function useCart() {
	const {
		cart,
		addToCart,
		removeFromCart,
		getCart,
		isInCart,
		mergeCartsOnLogin,
	} = useApiContext();
	return {
		cart,
		addToCart,
		removeFromCart,
		getCart,
		isInCart,
		mergeCartsOnLogin,
	};
}
