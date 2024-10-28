import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { User, connectToDatabase } from '@/library/User';
import { Token } from '@/types';

export async function GET() {
	try {
		await connectToDatabase();

		const cookieStore = cookies();
		const token = cookieStore.get('token');

		if (!token) {
			return NextResponse.json({ error: 'No token found' }, { status: 401 });
		}

		try {
			const decodedToken = jwt.verify(
				token.value,
				process.env.JWT_SECRET!
			) as Token;

			const user = await User.findById(decodedToken.sub);

			if (!user) {
				return NextResponse.json(
					{ error: 'User not found' },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				status: 'success',
				message: 'Token is valid',
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					cart: user.cart,
					purchased: user.purchased,
				},
			});
		} catch (jwtError) {
			console.error('JWT verification error:', jwtError);
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}
	} catch (error) {
		console.error('Account validation error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
