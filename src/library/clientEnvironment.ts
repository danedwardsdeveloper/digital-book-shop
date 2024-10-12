// clientEnvironment.ts

export function validateClientVariable(variableName: string): string {
	const value = process.env[variableName];
	if (typeof window !== 'undefined' && !value) {
		console.error(`Environment variable ${variableName} is missing`);
	}
	return value || '';
}

const nodeEnv = validateClientVariable('NEXT_PUBLIC_NODE_ENV');
const stripePublishableKey = validateClientVariable(
	'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
);

const isProduction = nodeEnv === 'production';
const isDevelopment = nodeEnv === 'development';

const developmentBaseURL = 'http://localhost:3000';
const productionBaseURL = 'https://digital-book-shop.fly.dev';
const dynamicBaseURL = isProduction ? productionBaseURL : developmentBaseURL;

export {
	isProduction,
	isDevelopment,
	developmentBaseURL,
	productionBaseURL,
	dynamicBaseURL,
	stripePublishableKey,
};
