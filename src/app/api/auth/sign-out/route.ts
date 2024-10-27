'use server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { createCookieOptions } from '@/library/cookies';
import { User, connectToDatabase } from '@/library/User';
import type { AppState, AppMessageStatus, Token } from '@/types';

export async function POST(): Promise<NextResponse<AppState>> {
	const cookieStore = cookies();
	const token = cookieStore.get('token');

	const createSignOutResponse = (responseData: AppState, status = 200) => {
		const response = NextResponse.json(responseData, { status });

		response.cookies.set('token', '', {
			...createCookieOptions(''),
			maxAge: 0,
			expires: new Date(0),
		});

		return response;
	};

	if (!token) {
		return createSignOutResponse({
			status: 'warning' as AppMessageStatus,
			message: 'Already signed out',
			signedIn: false,
			user: null,
		});
	}

	try {
		const decodedToken = jwt.verify(
			token.value,
			process.env.JWT_SECRET!
		) as Token;

		await connectToDatabase();
		const user = await User.findById(decodedToken.sub);
		const email = user?.email ?? 'Unknown user';

		return createSignOutResponse({
			status: 'success' as AppMessageStatus,
			message: `${email} signed out successfully`,
			signedIn: false,
			user: null,
		});
	} catch (error) {
		console.error('Sign-out error:', error);

		if (error instanceof jwt.JsonWebTokenError) {
			return createSignOutResponse({
				status: 'warning' as AppMessageStatus,
				message: 'Invalid session cleared',
				signedIn: false,
				user: null,
			});
		}

		return createSignOutResponse(
			{
				status: 'error' as AppMessageStatus,
				message: 'An error occurred during sign-out',
				signedIn: false,
				user: null,
			},
			500
		);
	}
}
