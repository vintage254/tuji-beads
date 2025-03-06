import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

// Admin password - in production, use environment variables
const ADMIN_PASSWORD = 'admin123';

// Generate a secure token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export async function POST(request) {
  try {
    const { password } = await request.json();

    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate a secure token
    const token = generateToken();
    
    // Set secure cookie with the token
    const cookieStore = cookies();
    cookieStore.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    // Store token in a server-side session store or database
    // For simplicity, we're just using the cookie here
    // In production, you might want to store this in a database

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 