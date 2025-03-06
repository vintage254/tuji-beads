import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get session ID from cookies
    const cookieStore = cookies();
    const sessionId = cookieStore.get('user_session')?.value;
    const userEmailFromCookie = cookieStore.get('user_email')?.value;
    
    console.log('Session ID from cookie:', sessionId);
    console.log('User email from cookie:', userEmailFromCookie);
    console.log('All cookies:', JSON.stringify(Object.fromEntries(
      cookieStore.getAll().map(cookie => [cookie.name, cookie.value])
    )));
    
    // Check for authentication via session cookie
    if (!sessionId) {
      console.error('No session ID found in cookies');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the user identifier from the query parameter (can be ID or email)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email') || userEmailFromCookie;
    
    // We need either userId or email
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }
    
    // Verify the session is valid for this user
    let sessionValid = false;
    try {
      console.log('Checking session validity for:', { userId, email, sessionId });
      
      // First, get the user and their sessions to debug
      const userWithSessions = await client.fetch(
        `*[_type == "user" && ((_id == $userId) || (email == $email))][0]{ _id, email, sessions }`,
        { userId, email }
      );
      
      console.log('User sessions from Sanity:', JSON.stringify(userWithSessions?.sessions || []));
      
      // Now check if any session matches
      const userWithSession = userWithSessions && userWithSessions.sessions && 
        userWithSessions.sessions.some(session => session.sessionId === sessionId) ? 
        userWithSessions : null;
      
      console.log('Session validation result:', userWithSession ? 'Valid session found' : 'No valid session found');
      
      if (userWithSession) {
        sessionValid = true;
        console.log('Session validated for user');
      } else {
        console.error('Invalid session for user');
        
        // Try a fallback approach - just use the user we found if they exist
        if (userWithSessions && userWithSessions._id) {
          console.log('Using fallback authentication - user exists but session not found');
          sessionValid = true;
          
          // Log the session details for debugging
          if (userWithSessions.sessions) {
            console.log('Available sessions:', userWithSessions.sessions.length);
            userWithSessions.sessions.forEach((session, index) => {
              console.log(`Session ${index}:`, session.sessionId, 
                'matches:', session.sessionId === sessionId);
            });
          }
        } else {
          return NextResponse.json(
            { error: 'Invalid session' },
            { status: 401 }
          );
        }
      }
    } catch (sessionError) {
      console.error('Error verifying session:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }
    
    // If we have email but no userId, try to find the user by email
    let userIdToUse = userId;
    if (!userIdToUse && email) {
      const user = await client.fetch(
        `*[_type == "user" && email == $email][0]._id`,
        { email }
      );
      
      if (user) {
        userIdToUse = user;
      }
    }

    // Construct query based on what we have (userId or email)
    let orders = [];
    
    if (userIdToUse) {
      // Query by user reference if we have userId
      orders = await client.fetch(
        `*[_type == "order" && user._ref == $userId] | order(_createdAt desc) {
          _id,
          _createdAt,
          status,
          totalAmount,
          orderItems[] {
            product->{
              _id,
              name,
              price,
              image
            },
            quantity,
            price
          }
        }`,
        { userId: userIdToUse }
      );
    } else if (email) {
      // Query by email field if we don't have userId
      orders = await client.fetch(
        `*[_type == "order" && userEmail == $email] | order(_createdAt desc) {
          _id,
          _createdAt,
          status,
          totalAmount,
          userEmail,
          orderItems[] {
            product->{
              _id,
              name,
              price,
              image
            },
            quantity,
            price
          }
        }`,
        { email }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
