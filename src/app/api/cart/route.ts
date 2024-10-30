import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import type { AppState, UserType, StaticBook, CartItem } from '@/types';
import { Token } from '@/library/cookies';
import { User, connectToDatabase } from '@/library/User';
import { getBookBySlug } from '@/library/books';

export async function GET() {
	try {
		await connectToDatabase();

		const cookieStore = cookies();
		const token = cookieStore.get('token');

		if (!token) {
			return NextResponse.json<AppState>({
				status: 'error',
				message: 'Not authenticated',
				signedIn: false,
				user: null,
			});
		}

		let decoded: Token;

		try {
			decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as Token;
		} catch (error) {
			console.error('Invalid token', error);
			return NextResponse.json<AppState>({
				status: 'error',
				message: 'Invalid token',
				signedIn: false,
				user: null,
			});
		}

		const user = await User.findById(decoded.sub);

		if (!user) {
			return NextResponse.json<AppState>({
				status: 'error',
				message: 'User not found',
				signedIn: false,
				user: null,
			});
		}

		const userWithBookDetails: UserType = {
			id: user._id.toString(),
			name: user.name,
			email: user.email,
			cart: user.cart
				.map((item: CartItem) => {
					const book = getBookBySlug(item.slug);
					return book ? { ...book, slug: item.slug } : null;
				})
				.filter(Boolean) as StaticBook[],
			purchased: user.purchased,
		};

		return NextResponse.json<AppState>({
			status: 'success',
			message: null,
			signedIn: true,
			user: userWithBookDetails,
		});
	} catch (error) {
		console.error('Error in cart route:', error);
		return NextResponse.json<AppState>({
			status: 'error',
			message: 'An error occurred',
			signedIn: false,
			user: null,
		});
	}
}
