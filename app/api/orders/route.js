import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    console.log('=== ORDERS API CALLED ===');
    
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
    
    // Verify the session is valid for this user
    let userIdToUse = null;
    let userEmail = null;
    
    try {
      console.log('Validating session:', { sessionId });
      
      // First, find the user by their session ID
      const userWithSessions = await client.fetch(
        `*[_type == "user" && count(sessions[sessionId == $sessionId]) > 0][0]{ 
          _id, 
          email, 
          sessions 
        }`,
        { sessionId }
      );
      
      if (!userWithSessions) {
        console.error('No user found with this session ID');
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 401 }
        );
      }
      
      console.log('Found user by session:', { id: userWithSessions._id, email: userWithSessions.email });
      
      // Store the user ID and email for later use
      userIdToUse = userWithSessions._id;
      userEmail = userWithSessions.email;
      
      // Update the session's lastActive timestamp
      try {
        const updatedSessions = userWithSessions.sessions.map(session => {
          if (session.sessionId === sessionId) {
            return {
              ...session,
              lastActive: new Date().toISOString()
            };
          }
          return session;
        });
        
        await client.patch(userWithSessions._id)
          .set({ sessions: updatedSessions })
          .commit();
          
        console.log('Updated session lastActive timestamp');
      } catch (sessionUpdateError) {
        console.error('Failed to update session timestamp:', sessionUpdateError);
        // Continue anyway, not critical
      }
    } catch (sessionError) {
      console.error('Error verifying session:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }

    // Construct query to fetch orders for this user
    let orders = [];
    
    try {
      // Query by user reference (primary) and email (backup)
      console.log('Fetching orders for user:', { id: userIdToUse, email: userEmail });
      
      orders = await client.fetch(
        `*[_type == "order" && (user._ref == $userId || userEmail == $email)] | order(_createdAt desc) {
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
        { 
          userId: userIdToUse,
          email: userEmail
        }
      );
      
      console.log(`Found ${orders.length} orders`);
      
      // Transform the orders to ensure they have consistent structure
      const transformedOrders = orders.map(order => ({
        _id: order._id,
        orderNumber: order._id.substring(0, 8).toUpperCase(),
        createdAt: order._createdAt,
        status: order.status || 'processing',
        total: order.totalAmount,
        items: (order.orderItems || []).map(item => ({
          _id: item._id || 'unknown',
          product: {
            name: item.product?.name || 'Product name unavailable',
            price: item.product?.price || 0,
          },
          quantity: item.quantity || 1,
        })),
      }));
      
      return NextResponse.json(transformedOrders, { status: 200 });
    } catch (fetchError) {
      console.error('Error fetching orders from Sanity:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch orders from database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
