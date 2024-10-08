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

		const body = await request.json();

		const { name, email, password } = body;

		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: 'Name, email, and password are required' },
				{ status: 400 }
			);
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 409 }
			);
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
			cart: [],
			purchased: [],
		});

		await newUser.save();

		const tokenPayload: Token = {
			sub: newUser._id.toString(),
			exp: Math.floor(Date.now() / 1000) + 60 * 60,
		};

		const token = jwt.sign(tokenPayload, jwtSecret);

		const response = NextResponse.json({
			status: 'success',
			message: 'Account created and signed in successfully',
			user: {
				id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				cart: newUser.cart,
				purchased: newUser.purchased,
			},
		});

		const cookieOptions = createCookieOptions(token);
		response.cookies.set(cookieOptions);

		return response;
	} catch (error) {
		console.error('Create account error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
