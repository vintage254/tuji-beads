import { client } from '../../../lib/client';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '../../../lib/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Check if the user is authenticated
    const user = isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the authenticated user is requesting their own orders
    // or if they have admin privileges
    if (user.userId !== userId && user.role !== 'admin') {
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
    
    const orders = await client.fetch(query, { userId });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
