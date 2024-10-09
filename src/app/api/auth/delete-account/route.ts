import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { isProduction } from '@/library/clientEnvironment';
import { jwtSecret } from '@/app/api/serverEnvironment';
import { type Token } from '@/types';
import { connectToDatabase, User } from '@/library/User';

export async function DELETE(request: NextRequest) {
	try {
		await connectToDatabase();

		const tokenCookie = request.cookies.get('token');

		if (!tokenCookie || !tokenCookie.value) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		const token = tokenCookie.value;

		let decodedToken: Token;
		try {
			decodedToken = jwt.verify(token, jwtSecret) as Token;
		} catch (error) {
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}

		const user = await User.findById(decodedToken.sub);

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		await User.findByIdAndDelete(user._id);

		const response = NextResponse.json({
			message: 'Account deleted successfully',
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
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
