import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { jwtSecret } from '@/app/api/serverEnvironment';
import { createCookieOptions } from '@/library/cookies';
import { User, connectToDatabase } from '@/library/User';
import type { ApiResponse, ApiStatus, Token, CartItem } from '@/types';

export async function POST(
	request: Request,
	{ params }: { params: { bookId: string } }
): Promise<NextResponse<ApiResponse>> {
	const cookieStore = cookies();
	const token = cookieStore.get('token');

	if (!token) {
		return NextResponse.json(
			{
				status: 'error' as ApiStatus,
				message: 'Not signed in',
				loggedIn: false,
				user: null,
			},
			{ status: 401 }
		);
	}

	try {
		const decodedToken = jwt.verify(token.value, jwtSecret) as Token;

		await connectToDatabase();

		const user = await User.findById(decodedToken.sub);

		if (!user) {
			return NextResponse.json(
				{
					status: 'error' as ApiStatus,
					message: 'User not found',
					loggedIn: false,
					user: null,
				},
				{ status: 404 }
			);
		}

		const bookId = params.bookId;
		const cartItemIndex = user.cart.findIndex(
			(item: CartItem) => item.slug === bookId
		);

		if (cartItemIndex === -1) {
			return NextResponse.json(
				{
					status: 'info' as ApiStatus,
					message: 'Book not in cart',
					loggedIn: true,
					user: user.toObject(),
				},
				{ status: 200 }
			);
		}

		// Remove the book from the cart
		user.cart.splice(cartItemIndex, 1);
		await user.save();

		// Generate a new token with updated user data
		const newToken = jwt.sign({ sub: user._id }, jwtSecret, {
			expiresIn: '1h',
		});
		const cookieOptions = createCookieOptions(newToken);

		const response = NextResponse.json({
			status: 'success' as ApiStatus,
			message: 'Book removed from cart',
			loggedIn: true,
			user: user.toObject(),
		});

		response.cookies.set(cookieOptions);

		return response;
	} catch (error) {
		console.error('Remove from cart error:', error);

		if (error instanceof jwt.JsonWebTokenError) {
			return NextResponse.json(
				{
					status: 'error' as ApiStatus,
					message: 'Invalid session',
					loggedIn: false,
					user: null,
				},
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{
				status: 'error' as ApiStatus,
				message: 'An error occurred while removing book from cart',
				loggedIn: true,
				user: null,
			},
			{ status: 500 }
		);
	}
}
