'use server'

import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { books } from '@/library/books'
import { createCookieOptions, generateTokenPayload, type Token } from '@/library/cookies'
import { connectToDatabase, User } from '@/library/User'

import type { AppState, CartItem, UserType } from '@/types'

const jwtSecret = process.env.JWT_SECRET!

export async function POST(request: Request) {
  try {
    const { cart } = await request.json()

    await connectToDatabase()
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json<AppState>(
        {
          status: 'error',
          message: 'Not authenticated',
          signedIn: false,
          user: null,
        },
        { status: 401 },
      )
    }

    const decodedToken = jwt.verify(token, jwtSecret) as Token
    const userId = decodedToken.sub

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json<AppState>(
        {
          status: 'error',
          message: 'User not found',
          signedIn: false,
          user: null,
        },
        { status: 404 },
      )
    }

    // Validate all books in the cart
    const invalidBooks = cart.filter((item: CartItem) => !books.some(book => book.slug === item.slug))

    if (invalidBooks.length > 0) {
      return NextResponse.json<AppState>(
        {
          status: 'error',
          message: `Invalid book slugs found: ${invalidBooks
            .map((b: { slug: string }) => b.slug)
            .join(', ')}`,
          signedIn: true,
          user: user.toObject() as UserType,
        },
        { status: 400 },
      )
    }

    user.cart = cart
    await user.save()

    const tokenPayload = generateTokenPayload(user._id.toString())
    const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!)
    const cookieOptions = createCookieOptions(newToken)

    const response = NextResponse.json<AppState>(
      {
        status: 'success',
        message: 'Cart synchronized successfully',
        signedIn: true,
        user: user.toObject() as UserType,
      },
      { status: 200 },
    )

    response.cookies.set(cookieOptions)

    return response
  } catch (error) {
    console.error('Error syncing cart:', error)
    return NextResponse.json<AppState>(
      {
        status: 'error',
        message: 'Internal server error',
        signedIn: false,
        user: null,
      },
      { status: 500 },
    )
  }
}
