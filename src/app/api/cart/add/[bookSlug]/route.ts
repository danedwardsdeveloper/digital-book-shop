'use server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import type { AppState, CartItem, Token, UserType } from '@/types';
import { createCookieOptions } from '@/library/cookies';
import { User, connectToDatabase } from '@/library/User';
import { books, getBookTitle } from '@/library/books';

const jwtSecret = process.env.JWT_SECRET!;

export async function POST(
	request: Request,
	{ params }: { params: { bookSlug: string } }
) {
	const { bookSlug } = params;
	const bookTitle = getBookTitle(bookSlug);

	try {
		await connectToDatabase();

		const token = cookies().get('token')?.value;

		if (!token) {
			return NextResponse.json<AppState>(
				{
					status: 'error',
					message: 'Not authenticated',
					signedIn: false,
					user: null,
				},
				{ status: 401 }
			);
		}

		const decodedToken = jwt.verify(token, jwtSecret) as Token;
		const userId = decodedToken.sub;

		const user = await User.findById(userId);

		if (!user) {
			return NextResponse.json<AppState>(
				{
					status: 'error',
					message: 'User not found',
					signedIn: false,
					user: null,
				},
				{ status: 404 }
			);
		}

		const validBook = books.find((book) => book.slug === bookSlug);
		if (!validBook) {
			return NextResponse.json<AppState>(
				{
					status: 'error',
					message: `Invalid book slug: ${bookSlug}`,
					signedIn: true,
					user: user.toObject() as UserType,
				},
				{ status: 200 }
			);
		}

		let message: string;
		let statusCode: number;

		const existingCartItem = user.cart.find(
			(item: CartItem) => item.slug === bookSlug
		);

		if (existingCartItem) {
			return NextResponse.json<AppState>(
				{
					status: 'info',
					message: `${bookTitle} is already in cart`,
					signedIn: true,
					user: user.toObject() as UserType,
				},
				{ status: 200 }
			);
		} else {
			user.cart.push({ slug: bookSlug, removed: false });
			await user.save();
			message = `${bookTitle} added to cart`;
			statusCode = 200;
		}

		const newToken = jwt.sign({ sub: user._id }, jwtSecret, {
			expiresIn: '1h',
		});
		const cookieOptions = createCookieOptions(newToken);

		const response = NextResponse.json<AppState>(
			{
				status: 'success',
				message,
				signedIn: true,
				user: user.toObject() as UserType,
			},
			{ status: statusCode }
		);

		response.cookies.set(cookieOptions);

		return response;
	} catch (error) {
		console.error('Error in cart operation:', error);
		return NextResponse.json<AppState>(
			{
				status: 'error',
				message: 'Internal server error',
				signedIn: false,
				user: null,
			},
			{ status: 500 }
		);
	}
}
