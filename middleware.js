import { NextResponse } from 'next/server';

// Helper function to parse cookies from header
function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) cookies[name] = value;
    });
  }
  return cookies;
}

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/api/orders/create',
    '/order-history',
    '/profile',
    '/checkout'
  ];

  // Define studio routes that require admin authentication
  const studioRoutes = [
    '/studio',
    '/studio-direct'
  ];

  // Special handling for order-history to prevent static generation issues
  if (request.nextUrl.pathname.startsWith('/order-history')) {
    // Set a header to indicate this is a dynamic route
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if the current path is a studio route requiring admin access
  const isStudioRoute = studioRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // If it's not a protected or studio route, allow the request to proceed
  if (!isProtectedRoute && !isStudioRoute) {
    return NextResponse.next();
  }

  // For studio routes, check for admin authentication
  if (isStudioRoute) {
    const cookieHeader = request.headers.get('cookie');
    
    // If we have cookies, check for admin session ID
    if (cookieHeader) {
      const parsedCookies = parseCookies(cookieHeader);
      const adminSessionId = parsedCookies['admin_session'];
      
      if (adminSessionId) {
        // Allow the request to proceed since admin is authenticated
        return NextResponse.next();
      }
    }
    
    // No valid admin authentication found, redirect to admin login
    return NextResponse.redirect(new URL('/admin-login', request.url));
  }

  // For API routes, check for session cookies
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const cookieHeader = request.headers.get('cookie');
    
    // If we have cookies, check for session ID
    if (cookieHeader) {
      const parsedCookies = parseCookies(cookieHeader);
      const sessionId = parsedCookies['user_session'];
      
      if (sessionId) {
        // If session cookie exists, allow the request to proceed
        // The actual endpoint will validate the session
        console.log('Session cookie found, allowing request to proceed');
        return NextResponse.next();
      }
    }
    
    // No valid authentication found
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
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
    '/checkout',
    '/studio/:path*',
    '/studio-direct/:path*'
  ],
};
