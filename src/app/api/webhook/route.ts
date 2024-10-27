import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

import { type CartItem } from '@/types';
import { connectToDatabase, User } from '@/library/User';

const useRealMoney = process.env.NEXT_PUBLIC_USE_REAL_MONEY === 'true';

const stripeSecretKey = useRealMoney
	? process.env.STRIPE_SECRET_KEY!
	: process.env.STRIPE_SECRET_TEST_KEY!;

const stripe = new Stripe(stripeSecretKey, {
	apiVersion: '2024-09-30.acacia',
});

const endpointSecret = useRealMoney
	? process.env.STRIPE_WEBHOOK_SECRET!
	: process.env.STRIPE_TEST_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
	try {
		const payload = await req.text();
		const sig = req.headers.get('stripe-signature')!;

		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
		} catch (error) {
			if (error instanceof Stripe.errors.StripeError) {
				console.error(`Stripe Webhook Error: ${error.message}`);
				return NextResponse.json({ error: error.message }, { status: 400 });
			}
			console.error(`Webhook Error: ${error}`);
			return NextResponse.json(
				{ error: 'Invalid webhook' },
				{ status: 400 }
			);
		}

		if (event.type === 'checkout.session.completed') {
			const session = event.data.object as Stripe.Checkout.Session;
			await handleCheckoutSessionCompleted(session);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return NextResponse.json(
			{ error: 'An error occurred processing the webhook' },
			{ status: 500 }
		);
	}
}

async function handleCheckoutSessionCompleted(
	session: Stripe.Checkout.Session
) {
	await connectToDatabase();

	const userId = session.client_reference_id;
	if (!userId) {
		console.error('No user ID found in session');
		return;
	}

	const user = await User.findById(userId);
	if (!user) {
		console.error(`User not found: ${userId}`);
		return;
	}

	const purchasedItems = user.cart
		.filter((item: CartItem) => !item.removed)
		.map((item: CartItem) => ({
			...item,
			downloads: 0,
		}));

	await User.findByIdAndUpdate(userId, {
		$push: { purchased: { $each: purchasedItems } },
		$set: { cart: [] },
	});
}
