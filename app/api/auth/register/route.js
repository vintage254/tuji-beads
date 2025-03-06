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

    // Create a simple session identifier
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Update user in Sanity with session info
    try {
      await client.patch(user._id)
        .set({
          lastLogin: new Date().toISOString(),
          sessionId: sessionId
        })
        .commit();
      
      console.log('Updated user session in Sanity');
    } catch (updateError) {
      console.error('Failed to update user session in Sanity:', updateError);
      // Continue anyway, not critical
    }

    // Set cookie with simple session info
    const response = NextResponse.json({
      user: userWithoutPassword,
      sessionId: sessionId
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
