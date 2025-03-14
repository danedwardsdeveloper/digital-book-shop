'use server'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

import { createCookieOptions, generateTokenPayload } from '@/library/cookies'
import { connectToDatabase, User } from '@/library/User'

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cart: [],
      purchased: [],
    })

    await newUser.save()

    const tokenPayload = generateTokenPayload(newUser._id.toString())

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!)

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
    })

    const cookieOptions = createCookieOptions(token)
    response.cookies.set(cookieOptions)

    return response
  } catch (error) {
    console.error('Create account error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
