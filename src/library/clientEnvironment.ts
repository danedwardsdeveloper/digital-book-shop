export function validateVariable(variableName: string): string {
	const value = process.env[variableName];
	if (!value) {
		throw new Error(`Environment variable ${variableName} is missing`);
	}
	return value;
}

const nodeEnv = validateVariable('NODE_ENV');

if (!nodeEnv) {
	throw new Error('NODE_ENV missing');
}

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
};
