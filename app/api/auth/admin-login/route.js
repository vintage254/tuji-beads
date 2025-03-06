import { NextResponse } from 'next/server';

// Set this route to be dynamically rendered
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { password } = await request.json();

    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Get the admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if the admin password is set
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Compare passwords
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Create a simple session identifier for admin
    const adminSessionId = 'admin_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Set cookie with admin session info
    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful'
    });

    // Set cookies for admin session management
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
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
