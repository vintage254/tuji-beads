import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get session ID from cookies
    const cookieStore = cookies();
    const sessionId = cookieStore.get('user_session')?.value;
    const userEmail = cookieStore.get('user_email')?.value;
    
    console.log('Validating admin session for:', { sessionId, userEmail });
    
    // Check if we have both session ID and email
    if (!sessionId || !userEmail) {
      return NextResponse.json(
        { valid: false, error: 'No session found' },
        { status: 401 }
      );
    }
    
    // Find user by email and check if session exists and user has admin role
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]{
        _id,
        name,
        email,
        role,
        sessions
      }`,
      { email: userEmail }
    );
    
    if (!user) {
      return NextResponse.json(
        { valid: false, error: 'User not found' },
        { status: 401 }
      );
    }
    
    // Check if user has admin role
    if (user.role !== 'admin') {
      return NextResponse.json(
        { valid: false, error: 'User is not an admin' },
        { status: 403 }
      );
    }
    
    // Check if session exists in user's sessions
    const sessionValid = user.sessions && 
      user.sessions.some(session => session.sessionId === sessionId);
    
    // Create a response with the user data
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    // Update session timestamp if found
    if (sessionValid) {
      try {
        const updatedSessions = user.sessions.map(session => {
          if (session.sessionId === sessionId) {
            return {
              ...session,
              lastActive: new Date().toISOString()
            };
          }
          return session;
        });
        
        await client.patch(user._id)
          .set({ sessions: updatedSessions })
          .commit();
          
        console.log('Updated admin session lastActive timestamp');
      } catch (sessionUpdateError) {
        console.error('Failed to update admin session timestamp:', sessionUpdateError);
        // Continue anyway, not critical
      }
    }
    
    // Refresh cookies to extend their lifetime
    const response = NextResponse.json({
      valid: true,
      user: userResponse
    });
    
    // Set cookies again to refresh their expiration
    response.cookies.set({
      name: 'user_session',
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });
    
    response.cookies.set({
      name: 'user_email',
      value: user.email,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Admin validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Admin validation failed' },
      { status: 500 }
    );
  }
}
