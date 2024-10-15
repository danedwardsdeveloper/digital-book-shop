'use server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { createCookieOptions } from '@/library/cookies';
import { User, connectToDatabase } from '@/library/User';
import type { ApiResponse, ApiStatus, Token } from '@/types';

export async function POST(): Promise<NextResponse<ApiResponse>> {
	const cookieStore = cookies();
	const token = cookieStore.get('token');

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
		const decodedToken = jwt.verify(
			token.value,
			process.env.JWT_SECRET!
		) as Token;

		await connectToDatabase();

		const user = await User.findById(decodedToken.sub);
		const email = user ? user.email : 'Unknown user';

		const response = NextResponse.json({
			status: 'success' as ApiStatus,
			message: `${email} signed out successfully`,
			signedIn: false,
			user: null,
		});

		const clearCookieOptions = createCookieOptions('');
		clearCookieOptions.maxAge = 0;
		response.cookies.set(clearCookieOptions);

		return response;
	} catch (error) {
		console.error('Sign-out error:', error);

		if (error instanceof jwt.JsonWebTokenError) {
			const response = NextResponse.json(
				{
					status: 'warning' as ApiStatus,
					message: 'Invalid session cleared',
					signedIn: false,
					user: null,
				},
				{ status: 200 }
			);

			const clearCookieOptions = createCookieOptions('');
			clearCookieOptions.maxAge = 0;
			response.cookies.set(clearCookieOptions);

			return response;
		}

		return NextResponse.json(
			{
				status: 'error' as ApiStatus,
				message: 'An error occurred during sign-out',
				signedIn: true,
				user: null,
			},
			{ status: 500 }
		);
	}
}
