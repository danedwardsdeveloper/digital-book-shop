import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { jwtSecret } from '@/app/api/serverEnvironment';
import { User, connectToDatabase } from '@/library/User';
import { Token } from '@/types';
import { createCookieOptions } from '@/library/cookies';

export async function POST(request: Request) {
	try {
		await connectToDatabase();

		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 }
			);
		}

		const user = await User.findOne({ email });

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		const tokenPayload: Token = {
			sub: user._id.toString(),
			exp: Math.floor(Date.now() / 1000) + 60 * 60,
		};

		const token = jwt.sign(tokenPayload, jwtSecret);

		const response = NextResponse.json({
			status: 'success',
			message: 'Sign in successful',
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				cart: user.cart,
				purchased: user.purchased,
			},
		});

		response.cookies.set(createCookieOptions(token));

		return response;
	} catch (error) {
		console.error('Sign-in error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
