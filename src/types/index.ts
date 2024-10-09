import { StaticImageData } from 'next/image';

export interface StaticBook {
	title: string;
	slug: string;
	author: string;
	price: number;
	description: string[];
	image: StaticImageData;
}

export interface CartItem {
	slug: string;
}

export interface PurchasedItem extends CartItem {
	downloads: number;
}

export interface UserType {
	id: string;
	name: string;
	email: string;
	cart: CartItem[];
	purchased: PurchasedItem[];
}

export type ApiStatus = 'success' | 'info' | 'warning' | 'error';

export interface ApiResponse {
	message: string | null;
	status: ApiStatus;
	loggedIn: boolean;
	user: UserType | null;
}

export interface Token {
	sub: string;
	exp: number;
}
