'use server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { createCookieOptions } from '@/library/cookies';
import { User, connectToDatabase } from '@/library/User';
import type { ApiResponse, ApiStatus, Token, CartItem } from '@/types';
import { getBookTitle } from '@/library/books';

const jwtSecret = process.env.JWT_SECRET!;

export async function POST(
	request: Request,
	{ params }: { params: { bookSlug: string } }
): Promise<NextResponse<ApiResponse>> {
	const cookieStore = cookies();
	const token = cookieStore.get('token');
	const { bookSlug } = params;
	const bookTitle = getBookTitle(bookSlug);

	if (!token) {
		return NextResponse.json(
			{
				status: 'error' as ApiStatus,
				message: 'Not signed in',
				signedIn: false,
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
					signedIn: false,
					user: null,
				},
				{ status: 404 }
			);
		}

		const cartItemIndex = user.cart.findIndex(
			(item: CartItem) => item.slug === bookSlug
		);

		if (cartItemIndex === -1) {
			return NextResponse.json(
				{
					status: 'info' as ApiStatus,
					message: 'Book not in cart',
					signedIn: true,
					user: user.toObject(),
				},
				{ status: 200 }
			);
		}

		user.cart.splice(cartItemIndex, 1);
		await user.save();

		const newToken = jwt.sign({ sub: user._id }, jwtSecret, {
			expiresIn: '1h',
		});
		const cookieOptions = createCookieOptions(newToken);

		const response = NextResponse.json({
			status: 'success' as ApiStatus,
			message: `${bookTitle} removed from cart`,
			signedIn: true,
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
					signedIn: false,
					user: null,
				},
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{
				status: 'error' as ApiStatus,
				message: `An error occurred while removing ${bookTitle} from cart`,
				signedIn: true,
				user: null,
			},
			{ status: 500 }
		);
	}
}
