/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	env: {
		JWT_SECRET: process.env.JWT_SECRET,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		MONGODB_URI: process.env.MONGODB_URI,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
	},
};
export default nextConfig;
