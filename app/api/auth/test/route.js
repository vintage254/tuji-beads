import { NextResponse } from 'next/server';
import { isAuthenticated, verifyToken } from '../../../../lib/auth';

// Using Edge Runtime since we've updated auth to use jose
export const runtime = 'edge';

export async function GET(request) {
  try {
    console.log('=== AUTH TEST ENDPOINT CALLED ===');
    
    // Log JWT secret info (safely)
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_change_this';
    console.log('JWT_SECRET configured:', !!jwtSecret);
    console.log('JWT_SECRET length:', jwtSecret.length);
    console.log('JWT_SECRET first 3 chars:', jwtSecret.substring(0, 3) + '...');
    
    // Log all request headers for debugging
    const headerEntries = Array.from(request.headers.entries());
    console.log('Request headers:', headerEntries.map(([key, value]) => 
      `${key}: ${key === 'authorization' ? 'Bearer [...]' : value}`
    ));
    
    // Log the authorization header for detailed debugging
    const authHeader = request.headers.get('Authorization');
    console.log('Authorization header present:', !!authHeader);
    
    let tokenVerificationResult = { 
      headerToken: null,
      cookieToken: null,
      isAuthenticated: false
    };
    
    // Try to verify token from Authorization header
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      console.log('Token from Authorization header length:', token.length);
      
      try {
        const headerTokenPayload = await verifyToken(token);
        tokenVerificationResult.headerToken = {
          valid: !!headerTokenPayload,
          payload: headerTokenPayload ? {
            userId: headerTokenPayload.userId,
            exp: headerTokenPayload.exp,
            iat: headerTokenPayload.iat
          } : null
        };
      } catch (tokenError) {
        console.error('Header token verification error:', tokenError.message);
        tokenVerificationResult.headerToken = {
          valid: false,
          error: tokenError.message
        };
      }
    }
    
    // Try to get token from cookies
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const cookies = {};
      cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) cookies[name] = value;
      });
      
      if (cookies['auth_token']) {
        try {
          const cookieTokenPayload = await verifyToken(cookies['auth_token']);
          tokenVerificationResult.cookieToken = {
            valid: !!cookieTokenPayload,
            payload: cookieTokenPayload ? {
              userId: cookieTokenPayload.userId,
              exp: cookieTokenPayload.exp,
              iat: cookieTokenPayload.iat
            } : null
          };
        } catch (tokenError) {
          console.error('Cookie token verification error:', tokenError.message);
          tokenVerificationResult.cookieToken = {
            valid: false,
            error: tokenError.message
          };
        }
      }
    }
    
    // Check if the user is authenticated using our helper function
    console.log('Calling isAuthenticated function...');
    const authUser = await isAuthenticated(request);
    tokenVerificationResult.isAuthenticated = !!authUser;
    
    if (authUser) {
      tokenVerificationResult.authenticatedUser = {
        userId: authUser.userId,
        role: authUser.role
      };
    }
    
    // Return detailed diagnostics
    return NextResponse.json({
      message: 'Authentication test endpoint',
      authenticated: !!authUser,
      tokenVerification: tokenVerificationResult,
      serverTime: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      { 
        error: 'Auth test failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
