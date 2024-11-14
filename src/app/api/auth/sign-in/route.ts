'use server'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

import { createCookieOptions, generateTokenPayload } from '@/library/cookies'
import { connectToDatabase, User } from '@/library/User'

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const tokenPayload = generateTokenPayload(user._id.toString())

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!)

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
    })

    response.cookies.set(createCookieOptions(token))

    return response
  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
