import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../../lib/auth';

// Using Edge Runtime since we've updated auth to use jose
export const runtime = 'edge';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]{
        _id,
        name,
        email,
        phoneNumber,
        password,
        role
      }`,
      { email }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from user object before sending response
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
      token  // Include token in response body for client-side storage
    });

    // Set HTTP-only cookie for server-side auth
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    // Set a non-HTTP-only cookie for client-side detection of login state
    response.cookies.set({
      name: 'auth_status',
      value: 'logged_in',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
