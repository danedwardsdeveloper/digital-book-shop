'use server';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { isProduction } from '@/library/environment';
import type { Token, AppState, AppMessageStatus } from '@/types';
import { connectToDatabase, User } from '@/library/User';

export async function DELETE(
	request: NextRequest
): Promise<NextResponse<AppState>> {
	try {
		await connectToDatabase();

		const tokenCookie = request.cookies.get('token');

		if (!tokenCookie || !tokenCookie.value) {
			return NextResponse.json(
				{
					status: 'error',
					message: 'Authentication required',
					signedIn: false,
					user: null,
				},
				{ status: 401 }
			);
		}

		const token = tokenCookie.value;

		let decodedToken: Token;
		try {
			decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as Token;
		} catch (error) {
			console.error('JWT verification failed:', error);
			return NextResponse.json(
				{
					status: 'error',
					message: 'Invalid token',
					signedIn: false,
					user: null,
				},
				{ status: 401 }
			);
		}

		const user = await User.findById(decodedToken.sub);

		if (!user) {
			return NextResponse.json(
				{
					status: 'error',
					message: 'User not found',
					signedIn: false,
					user: null,
				},
				{ status: 404 }
			);
		}

		await User.findByIdAndDelete(user._id);

		const response = NextResponse.json({
			status: 'success' as AppMessageStatus,
			message: 'Account deleted successfully',
			signedIn: false,
			user: null,
		});

		response.cookies.set('token', '', {
			httpOnly: true,
			secure: isProduction,
			sameSite: 'strict',
			maxAge: 0,
			path: '/',
		});

		return response;
	} catch (error) {
		console.error('Delete account error:', error);
		return NextResponse.json(
			{
				status: 'error',
				message: 'An unexpected error occurred',
				signedIn: false,
				user: null,
			},
			{ status: 500 }
		);
	}
}
