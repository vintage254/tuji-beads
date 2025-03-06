import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get admin token from cookies
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    
    // Check if token exists
    if (!adminToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // In a real application, you would validate the token against a database
    // For simplicity, we're just checking if the token exists

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Check auth error:', error);
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    );
  }
} 