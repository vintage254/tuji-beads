import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get admin session ID from cookies
    const cookieStore = cookies();
    const adminSessionId = cookieStore.get('admin_session')?.value;
    
    console.log('Validating admin session:', { adminSessionId });
    
    // Check if we have admin session ID
    if (!adminSessionId) {
      return NextResponse.json(
        { valid: false, error: 'No admin session found' },
        { status: 401 }
      );
    }
    
    // Admin session exists, refresh the cookie
    const response = NextResponse.json({
      valid: true,
      message: 'Admin session is valid'
    });
    
    // Set cookies again to refresh their expiration
    response.cookies.set({
      name: 'admin_session',
      value: adminSessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Admin session validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Admin session validation failed' },
      { status: 500 }
    );
  }
}
