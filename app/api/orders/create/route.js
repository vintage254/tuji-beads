import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { items, totalAmount, userId } = await request.json();

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
        headers: { 'Content-Type': 'application/json' },
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
