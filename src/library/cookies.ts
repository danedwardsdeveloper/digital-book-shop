import { isProduction } from './environment';

type CookieOptions = {
	name: string;
	value: string;
	httpOnly: boolean;
	secure: boolean;
	sameSite: 'strict';
	maxAge: number;
	path: string;
};

export function createCookieOptions(token: string): CookieOptions {
	return {
		name: 'token',
		value: token,
		httpOnly: true,
		secure: isProduction,
		sameSite: 'strict',
		maxAge: 60 * 60,
		path: '/',
	};
}

export interface Token {
	sub: string;
	exp: number;
}

export function generateTokenPayload(userId: string): Token {
	return {
		sub: userId,
		exp: Math.floor(Date.now() / 1000) + 60 * 60,
	};
}
