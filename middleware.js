import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/api/orders/create',
    '/order-history',
    '/profile',
    '/checkout'
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // If it's not a protected route, allow the request to proceed
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For API routes, check Authorization header
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_change_this');
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }
  
  // For page routes, redirect to login if not authenticated
  // We'll implement a client-side check for these routes
  // since we're using a modal for authentication
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/api/orders/:path*',
    '/order-history',
    '/profile',
    '/checkout'
  ],
};
