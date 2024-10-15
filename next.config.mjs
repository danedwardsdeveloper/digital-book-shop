/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	env: {
		JWT_SECRET: process.env.JWT_SECRET,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_SECRET_TEST_KEY: process.env.STRIPE_SECRET_TEST_KEY,
		MONGODB_URI: process.env.MONGODB_URI,
		NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
		NEXT_PUBLIC_STRIPE_TEST_KEY: process.env.NEXT_PUBLIC_STRIPE_TEST_KEY,
		NEXT_PUBLIC_USE_REAL_MONEY: process.env.NEXT_PUBLIC_USE_REAL_MONEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
	},
};
export default nextConfig;
