import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '../../../lib/auth';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

// Add edge runtime
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
        // You would normally decode the token here to get the userId
        // For simplicity, we'll just use a placeholder
        // In a real app, you'd use something like:
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // userIdToUse = decoded.userId;
        
        // For now, just return an error if no userId provided
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: 400 }
        );
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
