export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

export const developmentBaseURL = 'http://localhost:3000';
export const productionBaseURL = 'https://digital-book-shop.fly.dev';
export const dynamicBaseURL = isProduction
	? productionBaseURL
	: developmentBaseURL;
