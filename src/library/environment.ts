export const jwtSecret = process.env.JWT_SECRET as string;
if (!jwtSecret) {
	throw new Error('JWT_SECRET missing');
}

export const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
if (!stripeSecretKey) {
	throw new Error('STRIPE_SECRET_KEY missing');
}

export const mongodbUri = process.env.MONGODB_URI as string;
if (!mongodbUri) {
	throw new Error('MONGODB_URI missing');
}

export const stripePublishableKey = process.env
	.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
if (!stripePublishableKey) {
	throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY missing');
}

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

export const developmentBaseURL = 'http://localhost:3000';
export const productionBaseURL = 'https://digital-book-shop.fly.dev';
export const dynamicBaseURL = isProduction
	? productionBaseURL
	: developmentBaseURL;
