import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../lib/auth';

// Using Edge Runtime since we've updated auth to use jose
export const runtime = 'edge';

export async function POST(request) {
  try {
    // Log the authorization header for debugging
    const authHeader = request.headers.get('Authorization');
    console.log('Authorization header present:', !!authHeader);
    if (authHeader) {
      console.log('Authorization header format:', authHeader.startsWith('Bearer ') ? 'Valid Bearer format' : 'Invalid format');
    }
    
    // Check if the user is authenticated
    const authUser = await isAuthenticated(request);
    
    if (!authUser) {
      console.error('Authentication failed: No valid user found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Log authentication success
    console.log('User authenticated:', authUser.userId);
    
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
    
    const { items, totalAmount, userId } = requestData;
    
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
    
    // Use the authenticated user's ID if userId is not provided
    const userIdToUse = userId || authUser.userId;
    
    // Verify that the authenticated user is creating their own order
    if (authUser.userId !== userIdToUse && authUser.role !== 'admin') {
      console.error('Authorization failed: User tried to create order for another user');
      return NextResponse.json(
        { error: 'Unauthorized to create order for another user' },
        { status: 403 }
      );
    }

    // Create order document
    const orderDoc = {
      _type: 'order',
      user: {
        _type: 'reference',
        _ref: userIdToUse
      },
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
            'Content-Type': 'application/json',
            'Authorization': request.headers.get('Authorization') || ''
          },
          body: JSON.stringify({
            orderId: createdOrder._id,
            items,
            totalAmount,
            userId: userIdToUse
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
    
    // Provide more detailed error information for debugging
    let statusCode = 500;
    let errorMessage = 'Failed to create order';
    
    if (error.message && error.message.includes('authentication')) {
      statusCode = 401;
      errorMessage = 'Authentication error: ' + error.message;
    } else if (error.message && error.message.includes('permission')) {
      statusCode = 403;
      errorMessage = 'Permission denied: ' + error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage, message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: statusCode }
    );
  }
}
