import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

import { jwtSecret, stripeSecretKey } from '../serverEnvironment';
import { dynamicBaseURL } from '@/library/clientEnvironment';
import type { ApiStatus, CartItem, Token } from '@/types';
import { User, connectToDatabase } from '@/library/User';
import { books } from '@/library/books';

const stripe = new Stripe(stripeSecretKey, {
	apiVersion: '2024-09-30.acacia',
});

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();

		const token = cookies().get('token')?.value;
		if (!token) {
			return NextResponse.json(
				{ status: 'error', message: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const decodedToken = jwt.verify(token, jwtSecret) as Token;
		const userId = decodedToken.sub;

		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json(
				{ status: 'error' as ApiStatus, message: 'User not found' },
				{ status: 404 }
			);
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: user.cart.map((item: CartItem) => {
				const book = books.find((b) => b.slug === item.slug);
				return {
					price_data: {
						currency: 'gbp',
						product_data: {
							name: book ? book.title : 'Unknown Book',
						},
						unit_amount: book ? book.price * 100 : 0,
					},
					quantity: 1,
				};
			}),
			mode: 'payment',
			success_url: `${dynamicBaseURL}/account`,
			cancel_url: `${dynamicBaseURL}/`,
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
