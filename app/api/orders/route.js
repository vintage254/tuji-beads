import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get the user identifier from the query parameter (can be ID or email)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    
    // We need either userId or email
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
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
