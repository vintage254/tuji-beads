import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

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

    // Generate session ID for new user
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();
    
    // Create user document with session
    const user = await client.create({
      _type: 'user',
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: 'customer',
      createdAt: now,
      lastLogin: now,
      sessions: [{
        sessionId: sessionId,
        createdAt: now,
        lastActive: now
      }]
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    // Session is already created during user creation, no need to update again

    // Set cookie with simple session info
    const response = NextResponse.json({
      user: userWithoutPassword,
      sessionId: sessionId // Using the sessionId created earlier
    });

    // Set cookies for session management
    response.cookies.set({
      name: 'user_session',
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    // Set user email in a non-HTTP-only cookie for client access
    response.cookies.set({
      name: 'user_email',
      value: user.email,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    console.log('User registered successfully with session ID');

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
