'use server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

import { dynamicBaseURL } from '@/library/environment';
import type { ApiStatus, CartItem, Token } from '@/types';
import { User, connectToDatabase } from '@/library/User';
import { books } from '@/library/books';

const useRealMoney = process.env.NEXT_PUBLIC_USE_REAL_MONEY === 'true';

const stripeSecretKey = useRealMoney
	? process.env.STRIPE_SECRET_KEY!
	: process.env.STRIPE_SECRET_TEST_KEY!;

const stripe = new Stripe(stripeSecretKey, {
	apiVersion: '2024-09-30.acacia',
});

type StripeLineItem = Stripe.Checkout.SessionCreateParams.LineItem;

export async function POST() {
	try {
		await connectToDatabase();

		const token = cookies().get('token')?.value;
		if (!token) {
			return NextResponse.json(
				{ status: 'error', message: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as Token;
		const userId = decodedToken.sub;

		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json(
				{ status: 'error' as ApiStatus, message: 'User not found' },
				{ status: 404 }
			);
		}

		const activeCartItems = user.cart.filter(
			(item: CartItem) => !item.removed
		);

		if (activeCartItems.length === 0) {
			return NextResponse.json(
				{ status: 'error' as ApiStatus, message: 'Your cart is empty' },
				{ status: 400 }
			);
		}

		const lineItems: StripeLineItem[] = activeCartItems
			.map((item: CartItem) => {
				const book = books.find((book) => book.slug === item.slug);
				if (!book) {
					console.error(`Book not found for slug: ${item.slug}`);
					return null;
				}
				return {
					price_data: {
						currency: 'gbp',
						product_data: {
							name: book.title,
						},
						unit_amount: book.price * 100,
					},
					quantity: 1,
				};
			})
			.filter((item: StripeLineItem) => item !== null);

		if (lineItems.length === 0) {
			return NextResponse.json(
				{ status: 'error' as ApiStatus, message: 'No valid items in cart' },
				{ status: 400 }
			);
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: lineItems,
			mode: 'payment',
			success_url: `${dynamicBaseURL}/account`,
			cancel_url: `${dynamicBaseURL}/`,
			client_reference_id: userId,
		});

		return NextResponse.json({ status: 'success', sessionId: session.id });
	} catch (error) {
		console.error('Checkout error:', error);
		return NextResponse.json(
			{
				status: 'error' as ApiStatus,
				message: 'An error occurred during checkout',
			},
			{ status: 500 }
		);
	}
}
