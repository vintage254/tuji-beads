import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    console.log('=== ORDER CREATE API CALLED ===');
    
    // Get session ID from cookies
    const cookieStore = cookies();
    const sessionId = cookieStore.get('user_session')?.value;
    const userEmail = cookieStore.get('user_email')?.value;
    
    console.log('Session ID from cookie:', sessionId);
    console.log('User email from cookie:', userEmail);
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
    
    // Simple user identification - either from request body or cookie
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { items, totalAmount, userId, email } = requestData;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }
    
    if (!totalAmount) {
      return NextResponse.json(
        { error: 'Total amount is required' },
        { status: 400 }
      );
    }
    
    // Use email from cookie if not provided in request
    const emailToUse = email || userEmail;
    
    if (!userId && !emailToUse) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }
    
    // Find the user by session ID
    let userIdToUse = userId;
    let userEmailToUse = emailToUse;
    
    try {
      // Find the user by their session ID (most reliable method)
      console.log('Finding user by session ID:', sessionId);
      
      const userWithSession = await client.fetch(
        `*[_type == "user" && count(sessions[sessionId == $sessionId]) > 0][0]{ 
          _id, 
          email, 
          sessions 
        }`,
        { sessionId }
      );
      
      if (!userWithSession) {
        console.error('No user found with this session ID');
        
        // If we have a userId or email from the request, try to use that as fallback
        if (userId) {
          console.log('Using provided userId as fallback:', userId);
          // Verify the user exists
          const userExists = await client.fetch(
            `*[_type == "user" && _id == $userId][0]._id`,
            { userId }
          );
          
          if (!userExists) {
            console.error('Provided userId does not exist in database');
            return NextResponse.json(
              { error: 'Invalid user ID' },
              { status: 400 }
            );
          }
        } else if (emailToUse) {
          console.log('Using provided email as fallback:', emailToUse);
          // Try to find user by email
          const userByEmail = await client.fetch(
            `*[_type == "user" && email == $email][0]._id`,
            { email: emailToUse }
          );
          
          if (userByEmail) {
            userIdToUse = userByEmail;
            console.log('Found user by email:', userIdToUse);
          } else {
            console.log('No user found with provided email, will create order with email reference only');
          }
        } else {
          return NextResponse.json(
            { error: 'Authentication failed. Please sign in again.' },
            { status: 401 }
          );
        }
      } else {
        // Use the verified user's ID and email
        userIdToUse = userWithSession._id;
        userEmailToUse = userWithSession.email;
        console.log('User authenticated via session:', userIdToUse, userEmailToUse);
        
        // Update the session's lastActive timestamp
        try {
          const updatedSessions = userWithSession.sessions.map(session => {
            if (session.sessionId === sessionId) {
              return {
                ...session,
                lastActive: new Date().toISOString()
              };
            }
            return session;
          });
          
          await client.patch(userWithSession._id)
            .set({ sessions: updatedSessions })
            .commit();
            
          console.log('Updated session lastActive timestamp');
        } catch (sessionUpdateError) {
          console.error('Failed to update session timestamp:', sessionUpdateError);
          // Continue anyway, not critical
        }
      }
    } catch (sessionError) {
      console.error('Error verifying session:', sessionError);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }

    // Create order document
    const orderDoc = {
      _type: 'order',
      // If we have a user ID, reference it, otherwise store email directly
      ...(userIdToUse ? {
        user: {
          _type: 'reference',
          _ref: userIdToUse
        }
      } : {}),
      // Always store email for redundancy and easier querying
      userEmail: userEmailToUse || email,
      orderItems: items.map(item => ({
        product: {
          _type: 'reference',
          _ref: item.productId
        },
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      status: 'pending',
      orderDate: new Date().toISOString()
    };
    
    console.log('Creating order document:', JSON.stringify(orderDoc, null, 2));

    // Create order in Sanity
    let createdOrder;
    try {
      createdOrder = await client.create(orderDoc);
      console.log('Order created successfully:', createdOrder._id);
    } catch (createError) {
      console.error('Failed to create order in Sanity:', createError);
      return NextResponse.json(
        { error: 'Failed to create order in database' },
        { status: 500 }
      );
    }

    // Try to send email notification if BASE_URL is defined
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-order-email`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: createdOrder._id,
            items,
            totalAmount,
            userId: userIdToUse,
            email: email // Include email for notification
          })
        });
        
        if (!emailResponse.ok) {
          console.warn('Email notification returned non-OK response:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Continue even if email fails
      }
    } else {
      console.log('Skipping email notification: NEXT_PUBLIC_BASE_URL not defined');
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: createdOrder._id,
        totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Simplified error handling
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}
