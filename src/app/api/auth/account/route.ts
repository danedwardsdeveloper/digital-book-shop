import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { User, connectToDatabase } from '@/library/User';
import { type Token } from '@/library/cookies';

export async function GET() {
	try {
		await connectToDatabase();

		const cookieStore = cookies();
		const token = cookieStore.get('token');

		if (!token) {
			return NextResponse.json(
				{
					signedIn: false,
					user: null,
				},
				{ status: 200 }
			);
		}

		try {
			const decodedToken = jwt.verify(
				token.value,
				process.env.JWT_SECRET!
			) as Token;

			const user = await User.findById(decodedToken.sub);

			if (!user) {
				return NextResponse.json(
					{
						status: 'error',
						message: 'User account not found',
						signedIn: false,
						user: null,
					},
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
			console.error('JWT error:', jwtError);
			return NextResponse.json(
				{
					status: 'warning',
					message: 'Session expired - please sign in.',
					signedIn: false,
					user: null,
				},
				{ status: 200 }
			);
		}
	} catch (error) {
		console.error('Server error:', error);
		return NextResponse.json(
			{
				status: 'error',
				message: 'Unable to verify account status',
				signedIn: false,
				user: null,
			},
			{ status: 500 }
		);
	}
}
