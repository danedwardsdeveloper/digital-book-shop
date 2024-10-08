function validateVariable(variableName: string): string {
	const value = process.env[variableName];
	if (!value) {
		throw new Error(`Environment variable ${variableName} is missing`);
	}
	return value;
}

const jwtSecret = validateVariable('JWT_SECRET');
const mongoURI = validateVariable('MONGODB_URI');
const stripeSecretKey = validateVariable('STRIPE_SECRET_KEY');
const stripeWebhookSecret = validateVariable('STRIPE_WEBHOOK_SECRET');

export { jwtSecret, mongoURI, stripeSecretKey, stripeWebhookSecret };
