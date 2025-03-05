import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderId, items, totalAmount, userId } = await request.json();

    // Get user details
    const userQuery = `*[_type == "user" && _id == $userId][0]{
      name,
      email,
      phoneNumber
    }`;
    const user = await client.fetch(userQuery, { userId });

    // Get product details
    const productIds = items.map(item => item.productId);
    const productsQuery = `*[_type == "product" && _id in $ids]{
      _id,
      name
    }`;
    const products = await client.fetch(productsQuery, { ids: productIds });

    // Create product lookup map
    const productMap = products.reduce((acc, product) => {
      acc[product._id] = product.name;
      return acc;
    }, {});

    // Format order items
    const formattedItems = items.map(item => ({
      name: productMap[item.productId],
      quantity: item.quantity,
      price: item.price
    }));

    // Send email (implement your email sending logic here)
    // For now, just log the details
    console.log('Order Email Details:', {
      to: 'derricknjuguna414@gmail.com',
      subject: `New Order from ${user.name}`,
      orderDetails: {
        orderId,
        customer: {
          name: user.name,
          email: user.email,
          phone: user.phoneNumber
        },
        items: formattedItems,
        totalAmount,
        orderDate: new Date().toISOString()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json(
      { error: 'Failed to send order email' },
      { status: 500 }
    );
  }
}
