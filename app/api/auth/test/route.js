import { NextResponse } from 'next/server';
import { isAuthenticated, verifyToken } from '../../../../lib/auth';
import { client } from '../../../../lib/client';
import { cookies } from 'next/headers';

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
    let cookieObj = {};
    
    if (cookieHeader) {
      cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) cookieObj[name] = value;
      });
      
      console.log('All cookies from request:', Object.keys(cookieObj));
      
      // Check for user_session cookie (new session system)
      if (cookieObj['user_session']) {
        console.log('Found user_session cookie:', cookieObj['user_session']);
        tokenVerificationResult.sessionCookie = {
          present: true,
          value: cookieObj['user_session']
        };
      }
      
      // Check for user_email cookie
      if (cookieObj['user_email']) {
        console.log('Found user_email cookie:', cookieObj['user_email']);
        tokenVerificationResult.userEmail = cookieObj['user_email'];
      }
      
      if (cookieObj['auth_token']) {
        try {
          const cookieTokenPayload = await verifyToken(cookieObj['auth_token']);
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
    
    // Check for session validation using the new session system
    try {
      const cookieStore = cookies();
      const sessionId = cookieStore.get('user_session')?.value;
      const userEmail = cookieStore.get('user_email')?.value;
      
      console.log('Checking session from cookies:', { sessionId, userEmail });
      
      if (sessionId && userEmail) {
        // Get user and their sessions for debugging
        const userWithSessions = await client.fetch(
          `*[_type == "user" && email == $email][0]{ _id, email, sessions }`,
          { email: userEmail }
        );
        
        console.log('User sessions from Sanity:', JSON.stringify(userWithSessions?.sessions || []));
        
        // Check if any session matches
        const sessionValid = userWithSessions && userWithSessions.sessions && 
          userWithSessions.sessions.some(session => session.sessionId === sessionId);
        
        tokenVerificationResult.sessionValidation = {
          sessionId,
          userEmail,
          userFound: !!userWithSessions,
          sessionsCount: userWithSessions?.sessions?.length || 0,
          sessionValid,
          sessions: userWithSessions?.sessions || []
        };
      }
    } catch (sessionError) {
      console.error('Session validation error:', sessionError);
      tokenVerificationResult.sessionValidation = {
        error: sessionError.message
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
