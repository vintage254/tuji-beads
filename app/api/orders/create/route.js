import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../lib/auth';

// Using Edge Runtime since we've updated auth to use jose
export const runtime = 'edge';

export async function POST(request) {
  try {
    // Check if the user is authenticated
    const authUser = await isAuthenticated(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { items, totalAmount, userId } = await request.json();
    
    // Verify that the authenticated user is creating their own order
    if (authUser.userId !== userId && authUser.role !== 'admin') {
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
        _ref: userId
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

    // Create order in Sanity
    const createdOrder = await client.create(orderDoc);

    // Try to send email notification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-order-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.headers.get('Authorization')?.split(' ')[1] || ''}` 
        },
        body: JSON.stringify({
          orderId: createdOrder._id,
          items,
          totalAmount,
          userId
        })
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
