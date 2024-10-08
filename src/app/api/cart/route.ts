import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import type {
	ApiResponse,
	Token,
	UserType,
	StaticBook,
	CartItem,
} from '@/types';
import { User, connectToDatabase } from '@/library/User';
import { books } from '@/library/books';

export async function GET() {
	try {
		await connectToDatabase();

		const cookieStore = cookies();
		const token = cookieStore.get('token');

		if (!token) {
			return NextResponse.json<ApiResponse>({
				status: 'error',
				message: 'Not authenticated',
				loggedIn: false,
				user: null,
			});
		}

		let decoded: Token;

		const JWT_SECRET = process.env.JWT_SECRET;

		if (!JWT_SECRET) {
			throw new Error('JWT_SECRET is not defined');
		}

		try {
			decoded = jwt.verify(token.value, JWT_SECRET) as Token;
		} catch (error) {
			return NextResponse.json<ApiResponse>({
				status: 'error',
				message: 'Invalid token',
				loggedIn: false,
				user: null,
			});
		}

		const user = await User.findById(decoded.sub);

		if (!user) {
			return NextResponse.json<ApiResponse>({
				status: 'error',
				message: 'User not found',
				loggedIn: false,
				user: null,
			});
		}

		const responseUser: UserType = {
			id: user._id.toString(),
			name: user.name,
			email: user.email,
			cart: user.cart
				.map((item: CartItem) => {
					const book = books.find((b) => b.slug === item.slug);
					return book ? { ...book, slug: item.slug } : null;
				})
				.filter((item: StaticBook): item is StaticBook => item !== null),
			purchased: user.purchased,
		};

		return NextResponse.json<ApiResponse>({
			status: 'success',
			message: null,
			loggedIn: true,
			user: responseUser,
		});
	} catch (error) {
		console.error('Error in cart route:', error);
		return NextResponse.json<ApiResponse>({
			status: 'error',
			message: 'An error occurred',
			loggedIn: false,
			user: null,
		});
	}
}
