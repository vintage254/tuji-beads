import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '../../../lib/auth';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get the user ID from the query parameter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify authentication
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch orders from Sanity
    const query = `*[_type == "order" && userId == $userId] {
      _id,
      _createdAt,
      userId,
      orderItems[]{
        quantity,
        product->{
          _id,
          name,
          price,
          slug,
          image
        }
      },
      total,
      status
    } | order(_createdAt desc)`;

    const orders = await client.fetch(query, { userId }).catch(error => {
      console.error('Error fetching orders from Sanity:', error);
      throw new Error('Failed to fetch orders from database');
    });

    // Return the orders
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error in orders API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
