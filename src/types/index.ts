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
	removed?: boolean;
}

export interface MongoCartItem extends CartItem {
	_id?: string;
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

export type AppMessageStatus = 'success' | 'info' | 'warning' | 'error';

export interface AppState {
	message: string | null;
	status: AppMessageStatus;
	signedIn: boolean;
	user: UserType | null;
}

export interface Token {
	sub: string;
	exp: number;
}
