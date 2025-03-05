import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import { isAuthenticated, verifyToken } from '../../../lib/auth';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

// Using Edge Runtime since we've updated auth to use jose
export const runtime = 'edge';

export async function GET(request) {
  try {
    // Get the user ID from the query parameter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Authenticate the user
    const authUser = await isAuthenticated(request);
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // If no userId in query params, use the one from the token
    let userIdToUse = userId || authUser.userId;
    
    // Admin can view any user's orders, regular users can only view their own
    if (authUser.role !== 'admin' && authUser.userId !== userIdToUse) {
      return NextResponse.json(
        { error: 'Unauthorized to view these orders' },
        { status: 403 }
      );
    }
    
    if (!userIdToUse) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Query for orders
    const orders = await client.fetch(
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

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
