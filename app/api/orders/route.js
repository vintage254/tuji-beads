import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '../../../lib/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get userId from query params first
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Try to authenticate, but don't fail if it doesn't work
    let user = null;
    try {
      user = isAuthenticated(request);
    } catch (authError) {
      console.error('Authentication error:', authError);
      // Continue without authentication
    }
    
    // If we have a user, check permissions
    if (user && user.userId !== userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to access these orders' },
        { status: 403 }
      );
    }
    
    // Enhanced query to fetch product details along with order information
    const query = `*[_type == "order" && user._ref == $userId] | order(_createdAt desc) {
      _id,
      _createdAt,
      orderItems[] {
        _key,
        quantity,
        price,
        product-> {
          _id,
          name,
          slug,
          image
        }
      },
      totalAmount,
      status
    }`;
    
    try {
      const orders = await client.fetch(query, { userId });
      return NextResponse.json(orders);
    } catch (fetchError) {
      console.error('Error fetching orders from Sanity:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch orders from database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in orders API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
