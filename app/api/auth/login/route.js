import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

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

    // Create a simple session identifier
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();
    
    // Update user in Sanity with session info
    try {
      // First check if the user already has sessions array
      const existingUser = await client.fetch(
        `*[_type == "user" && _id == $userId][0]{
          sessions
        }`,
        { userId: user._id }
      );
      
      if (existingUser && existingUser.sessions) {
        // User has existing sessions, add new one to array
        await client.patch(user._id)
          .set({
            lastLogin: now,
          })
          .setIfMissing({ sessions: [] })
          .append('sessions', [{ 
            sessionId: sessionId,
            createdAt: now,
            lastActive: now
          }])
          .commit();
      } else {
        // User doesn't have sessions array yet, create it
        await client.patch(user._id)
          .set({
            lastLogin: now,
            sessions: [{ 
              sessionId: sessionId,
              createdAt: now,
              lastActive: now
            }]
          })
          .commit();
      }
      
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

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
