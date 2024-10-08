import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import type { ApiResponse, CartItem, Token, UserType } from '@/types';
import { createCookieOptions } from '@/library/cookies';
import { User, connectToDatabase } from '@/library/User';
import { books } from '@/library/books';

export async function POST(
	request: Request,
	{ params }: { params: { bookId: string } }
) {
	const JWT_SECRET = process.env.JWT_SECRET;

	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	const bookId = params.bookId;

	try {
		await connectToDatabase();

		const token = cookies().get('token')?.value;

		if (!token) {
			return NextResponse.json<ApiResponse>(
				{
					status: 'error',
					message: 'Not authenticated',
					loggedIn: false,
					user: null,
				},
				{ status: 401 }
			);
		}

		const decodedToken = jwt.verify(token, JWT_SECRET) as Token;
		const userId = decodedToken.sub;

		const user = await User.findById(userId);

		if (!user) {
			return NextResponse.json<ApiResponse>(
				{
					status: 'error',
					message: 'User not found',
					loggedIn: false,
					user: null,
				},
				{ status: 404 }
			);
		}

		// Check if the bookId is valid
		const validBook = books.find((book) => book.slug === bookId);
		if (!validBook) {
			return NextResponse.json<ApiResponse>(
				{
					status: 'error',
					message: 'Invalid book ID',
					loggedIn: true,
					user: user.toObject() as UserType,
				},
				{ status: 200 }
			);
		}

		let message: string;
		let statusCode: number;

		// Check if the book is already in the cart
		const existingCartItem = user.cart.find(
			(item: CartItem) => item.slug === bookId
		);

		if (existingCartItem) {
			return NextResponse.json<ApiResponse>(
				{
					status: 'info',
					message: 'Book is already in cart',
					loggedIn: true,
					user: user.toObject() as UserType,
				},
				{ status: 200 }
			);
		} else {
			// Add the book to the cart
			user.cart.push({ slug: bookId });
			await user.save();
			message = 'Book added to cart';
			statusCode = 200;
		}

		// Generate a new token with updated user data
		const newToken = jwt.sign({ sub: user._id }, JWT_SECRET, {
			expiresIn: '1h',
		});
		const cookieOptions = createCookieOptions(newToken);

		// Create the response
		const response = NextResponse.json<ApiResponse>(
			{
				status: 'success',
				message,
				loggedIn: true,
				user: user.toObject() as UserType,
			},
			{ status: statusCode }
		);

		// Set the new token as a cookie
		response.cookies.set(cookieOptions);

		return response;
	} catch (error) {
		console.error('Error in cart operation:', error);
		return NextResponse.json<ApiResponse>(
			{
				status: 'error',
				message: 'Internal server error',
				loggedIn: false,
				user: null,
			},
			{ status: 500 }
		);
	}
}
