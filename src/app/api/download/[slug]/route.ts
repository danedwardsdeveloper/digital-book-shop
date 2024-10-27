import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

import { connectToDatabase, User } from '@/library/User';
import { type PurchasedItem, type Token } from '@/types';

async function getBookFile(slug: string): Promise<Buffer> {
	try {
		const filePath = path.join(process.cwd(), 'src/downloads', `${slug}.pdf`);
		await fs.access(filePath);
		const fileBuffer = await fs.readFile(filePath);
		return fileBuffer;
	} catch (error) {
		console.error(`Error reading book file: ${error}`);
		throw new Error(`Book file not found or inaccessible: ${slug}`);
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } }
) {
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

			const { slug } = params;
			if (typeof slug !== 'string') {
				return NextResponse.json(
					{ error: 'Invalid slug' },
					{ status: 400 }
				);
			}

			const purchasedItem = user.purchased.find(
				(item: PurchasedItem) => item.slug === slug
			);

			if (!purchasedItem || purchasedItem.downloads <= 0) {
				return NextResponse.json(
					{ error: 'No downloads remaining' },
					{ status: 403 }
				);
			}

			const fileBuffer = await getBookFile(slug);

			purchasedItem.downloads -= 1;
			await user.save();

			return new NextResponse(fileBuffer, {
				headers: {
					'Content-Type': 'application/pdf',
					'Content-Disposition': `attachment; filename="${slug}.pdf"`,
				},
			});
		} catch (jwtError) {
			console.error('JWT verification error:', jwtError);
			return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
		}
	} catch (error) {
		console.error('Download error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
