import { isProduction } from './clientEnvironment';

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
