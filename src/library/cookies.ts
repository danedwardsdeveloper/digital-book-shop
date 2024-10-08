const nodeEnv = process.env.NODE_ENV;
if (!nodeEnv) {
	throw new Error(`NODE_ENV isn't  not defined.`);
}
const isProduction = nodeEnv === 'production';

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
