import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../../lib/auth';

// Using Edge Runtime since we've updated auth to use jose
export const runtime = 'edge';

export async function POST(request) {
  try {
    const { name, email, password, phoneNumber } = await request.json();

    // Validate input
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user document
    const user = await client.create({
      _type: 'user',
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString()
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token using jose
    const token = await generateToken({
      _id: user._id,
      email: user.email,
      role: user.role || 'customer'
    });

    // Set cookie with the token
    const response = NextResponse.json({
      user: userWithoutPassword,
      token
    });

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
