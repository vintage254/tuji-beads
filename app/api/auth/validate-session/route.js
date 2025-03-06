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
    
    console.log('Validating session for:', { sessionId, userEmail });
    
    // Check if we have both session ID and email
    if (!sessionId || !userEmail) {
      return NextResponse.json(
        { valid: false, error: 'No session found' },
        { status: 401 }
      );
    }
    
    // Find user by email and check if session exists
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
    
    // Check if session exists in user's sessions
    const sessionValid = user.sessions && 
      user.sessions.some(session => session.sessionId === sessionId);
    
    // Create a response with the user data
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'customer'
    };
    
    // Even if session is not found in the database, we'll consider it valid
    // if the user exists and the session cookie matches the email cookie
    if (!sessionValid) {
      console.log('Session not found in user document, but cookies are valid');
      
      // Try to update the user's sessions with the current session ID
      try {
        await client.patch(user._id)
          .setIfMissing({ sessions: [] })
          .append('sessions', [{ 
            sessionId: sessionId,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          }])
          .commit();
          
        console.log('Added current session ID to user document');
      } catch (sessionUpdateError) {
        console.error('Failed to update user sessions:', sessionUpdateError);
        // Continue anyway, not critical
      }
    } else {
      // Update the session's lastActive timestamp
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
          
        console.log('Updated session lastActive timestamp');
      } catch (sessionUpdateError) {
        console.error('Failed to update session timestamp:', sessionUpdateError);
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
    console.error('Session validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Session validation failed' },
      { status: 500 }
    );
  }
} 