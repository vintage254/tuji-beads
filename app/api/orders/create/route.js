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
    
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }
    
    // Find or create user in Sanity
    let userIdToUse = userId;
    
    // If we only have email, find the user by email
    if (!userIdToUse && (email || userEmail)) {
      const emailToUse = email || userEmail;
      
      // Verify session if we have a user email
      if (emailToUse) {
        try {
          // Check if the session is valid for this user
          console.log('Checking session validity for email:', emailToUse, 'sessionId:', sessionId);
          const userWithSession = await client.fetch(
            `*[_type == "user" && email == $email && count(sessions[sessionId == $sessionId]) > 0][0]`,
            { email: emailToUse, sessionId }
          );
          
          console.log('Session validation result:', userWithSession ? 'Valid session found' : 'No valid session found');
          
          if (!userWithSession) {
            console.error('Invalid session for user');
            return NextResponse.json(
              { error: 'Invalid session' },
              { status: 401 }
            );
          }
          
          // Use the verified user's ID
          if (userWithSession._id) {
            userIdToUse = userWithSession._id;
            console.log('User authenticated via session:', userIdToUse);
          }
        } catch (sessionError) {
          console.error('Error verifying session:', sessionError);
        }
      }
      
      // If we still don't have a user ID, try to find by email
      if (!userIdToUse) {
        const existingUser = await client.fetch(
          `*[_type == "user" && email == $email][0]._id`,
          { email: emailToUse }
        );
        
        if (existingUser) {
          userIdToUse = existingUser;
        } else {
          // User doesn't exist, but we'll create the order anyway and link by email
          console.log('User not found in database, creating order with email reference');
        }
      }
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
      } : {
        userEmail: email // Store email directly if no user ID
      }),
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
