import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '../../../lib/auth';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

// Using Edge Runtime since we've updated auth to use jose
export const runtime = 'edge';

export async function GET(request) {
  try {
    // Get the user ID from the query parameter or from the authorization header
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // If no userId in query params, try to get it from the token
    let userIdToUse = userId;
    
    if (!userIdToUse && token) {
      try {
        // Use the jose library to verify and decode the token
        const { verifyToken } = await import('../../../lib/auth');
        const decoded = await verifyToken(token);
        
        if (decoded && decoded.userId) {
          userIdToUse = decoded.userId;
        } else {
          // If token is valid but doesn't contain userId
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
    }
    
    if (!userIdToUse) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Query for orders
    const orders = await client.fetch(
      `*[_type == "order" && userId == $userId] | order(createdAt desc) {
        _id,
        orderNumber,
        createdAt,
        status,
        total,
        items[] {
          _id,
          product->{
            name,
            price
          },
          quantity
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
