import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { client } from '../../../../lib/client';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Get session ID and email from cookies
    const cookieStore = cookies();
    const sessionId = cookieStore.get('user_session')?.value;
    const userEmail = cookieStore.get('user_email')?.value;
    
    console.log('Logout requested for session:', sessionId);
    console.log('Associated email:', userEmail);
    
    // If we have both session ID and email, invalidate the session in Sanity
    if (sessionId && userEmail) {
      try {
        console.log('Attempting to invalidate session in Sanity');
        
        // Find the user by email
        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]._id`,
          { email: userEmail }
        );
        
        if (user) {
          console.log('Found user with ID:', user);
          
          // Get current sessions
          const userData = await client.fetch(
            `*[_type == "user" && _id == $id][0]{ sessions }`,
            { id: user }
          );
          
          if (userData && userData.sessions) {
            console.log('Current session count:', userData.sessions.length);
            
            // Filter out the current session
            const updatedSessions = userData.sessions.filter(
              session => session.sessionId !== sessionId
            );
            
            console.log('New session count after removal:', updatedSessions.length);
            
            // Update user document with filtered sessions
            const patchResult = await client.patch(user)
              .set({ sessions: updatedSessions })
              .commit();
            
            console.log('Session invalidated in Sanity, updated user:', patchResult._id);
          } else {
            console.log('No sessions found for user');
          }
        } else {
          console.log('User not found with email:', userEmail);
        }
      } catch (sanityError) {
        console.error('Error invalidating session in Sanity:', sanityError);
        // Continue with cookie clearing regardless
      }
    } else {
      console.log('No session ID or email in cookies, skipping Sanity update');
    }
    
    // Create a response that will clear the session cookies
    const response = NextResponse.json({ success: true });
    
    // Clear all auth cookies
    response.cookies.set({
      name: 'user_session',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    response.cookies.set({
      name: 'user_email',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    console.log('Auth cookies cleared successfully');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
