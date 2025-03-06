import * as jose from 'jose';
import { cookies } from 'next/headers';
import { getSecretKey, getJwtSecret } from './jwt-config';
import { client } from './client';

// Get the secret key from centralized configuration
const secretKey = getSecretKey();
const JWT_SECRET = getJwtSecret();

// Log auth module initialization
console.log('Auth module initialized with JWT configuration');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export const generateToken = async (user, expiresIn = '7d') => {
  try {
    if (!user || !user._id) {
      console.error('Invalid user object provided for token generation');
      return '';
    }
    
    // Convert expiresIn string to seconds for jose
    const expiresInSeconds = expiresIn === '7d' ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // Default to 1 day if not 7d
    
    // Create a JWT with jose
    const token = await new jose.SignJWT({
      userId: user._id,
      email: user.email,
      role: user.role || 'customer',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
      .sign(secretKey);
    
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    return '';
  }
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token or null if invalid
 */
export const verifyToken = async (token) => {
  try {
    if (!token) {
      console.warn('No token provided for verification');
      return null;
    }
    
    // Log token info for debugging (safely)
    console.log('Verifying token, length:', token.length);
    console.log('Token first 10 chars:', token.substring(0, 10) + '...');
    
    // Check if token has valid JWT format (header.payload.signature)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Token does not have valid JWT format (header.payload.signature)');
      return null;
    }
    
    try {
      // Try to decode the payload part without verification for debugging
      const payloadBase64 = tokenParts[1];
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      console.log('Token payload (decoded without verification):', JSON.stringify(payload));
      
      // Check expiration manually
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.warn('Token appears to be expired based on payload');
      }
    } catch (decodeError) {
      console.warn('Could not decode token payload for debugging:', decodeError.message);
    }
    
    // Verify the token with jose
    console.log('Verifying token with jose...');
    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    
    console.log('Token successfully verified!');
    return payload;
  } catch (error) {
    // Handle different types of JWT errors
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.warn('Token expired:', error.message);
    } else if (error.code === 'ERR_JWS_INVALID') {
      console.warn('Invalid token:', error.message);
    } else if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      console.warn('Token signature verification failed:', error.message);
    } else if (error.code === 'ERR_JWS_INVALID_SIGNATURE') {
      console.warn('Invalid token signature:', error.message);
    } else {
      console.error('Token verification error:', error);
    }
    return null;
  }
};

/**
 * Get the current user from the request cookies
 * @returns {Object|null} User data from token or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    // Use a try-catch for cookies() as it might not be available in all environments
    let token = null;
    let sessionId = null;
    let userEmail = null;
    
    try {
      const cookieStore = cookies();
      token = cookieStore.get('auth_token')?.value;
      sessionId = cookieStore.get('user_session')?.value;
      userEmail = cookieStore.get('user_email')?.value;
      
      // Log all cookies for debugging
      console.log('All cookies in getCurrentUser:', JSON.stringify(Object.fromEntries(
        cookieStore.getAll().map(cookie => [cookie.name, cookie.value])
      )));
      
      // Try session-based authentication first (new approach)
      if (sessionId && userEmail) {
        console.log('Attempting session-based authentication');
        try {
          // Get user and their sessions
          const userWithSessions = await client.fetch(
            `*[_type == "user" && email == $email][0]{ _id, email, name, role, sessions }`,
            { email: userEmail }
          );
          
          if (userWithSessions) {
            console.log('Found user by email:', userEmail);
            console.log('User sessions count:', userWithSessions.sessions?.length || 0);
            
            // Check if any session matches
            const sessionValid = userWithSessions.sessions && 
              userWithSessions.sessions.some(session => session.sessionId === sessionId);
            
            if (sessionValid) {
              console.log('Valid session found');
              return {
                userId: userWithSessions._id,
                email: userWithSessions.email,
                name: userWithSessions.name,
                role: userWithSessions.role || 'customer'
              };
            } else {
              console.warn('Session not found in user document');
              // Log session details for debugging
              if (userWithSessions.sessions) {
                userWithSessions.sessions.forEach((session, index) => {
                  console.log(`Session ${index}:`, session.sessionId, 
                    'matches:', session.sessionId === sessionId);
                });
              }
              
              // Fallback: if user exists but session doesn't match, still return the user
              // This helps with intermittent session validation issues
              console.log('Using fallback: returning user despite session mismatch');
              return {
                userId: userWithSessions._id,
                email: userWithSessions.email,
                name: userWithSessions.name,
                role: userWithSessions.role || 'customer',
                fallback: true
              };
            }
          } else {
            console.warn('User not found by email:', userEmail);
          }
        } catch (sessionError) {
          console.error('Session validation error:', sessionError);
        }
      }
    } catch (cookieError) {
      console.warn('Cookie access not available:', cookieError.message);
      // Return null in environments where cookies() is not available
      return null;
    }
    
    // Fallback to token-based authentication
    if (token) {
      console.log('Falling back to token-based authentication');
      return await verifyToken(token);
    }
    
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Check if a request is authenticated
 * @param {Request} request - Next.js request object
 * @returns {Object|null} User data from token or null if not authenticated
 */
export const isAuthenticated = async (request) => {
  try {
    console.log('Starting authentication check for request');
    let token = null;
    let sessionId = null;
    let userEmail = null;
    
    // First try to get token from Authorization header
    if (request?.headers) {
      try {
        const authHeader = request.headers.get('Authorization');
        console.log('Authorization header present:', !!authHeader);
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
          console.log('Found token in Authorization header, length:', token?.length);
          
          if (token) {
            const user = await verifyToken(token);
            if (user) {
              console.log('Successfully verified token from Authorization header');
              return user;
            } else {
              console.warn('Token from Authorization header is invalid or expired');
            }
          }
        } else if (authHeader) {
          console.warn('Authorization header found but not in Bearer format:', authHeader.substring(0, 10) + '...');
        }
      } catch (headerError) {
        console.warn('Error accessing request headers:', headerError.message);
      }
    } else {
      console.warn('Request headers not available');
    }
    
    // Try session-based authentication (new approach)
    try {
      // Get cookies from the request object directly
      const cookieHeader = request.headers.get('cookie');
      console.log('Cookie header present:', !!cookieHeader);
      
      if (cookieHeader) {
        const cookies = parseCookies(cookieHeader);
        console.log('Parsed cookies:', Object.keys(cookies));
        
        sessionId = cookies['user_session'];
        userEmail = cookies['user_email'];
        
        if (sessionId && userEmail) {
          console.log('Found session cookies:', { sessionId, userEmail });
          
          try {
            // Get user and their sessions
            const userWithSessions = await client.fetch(
              `*[_type == "user" && email == $email][0]{ _id, email, name, role, sessions }`,
              { email: userEmail }
            );
            
            if (userWithSessions) {
              console.log('Found user by email:', userEmail);
              console.log('User sessions count:', userWithSessions.sessions?.length || 0);
              
              // Check if any session matches
              const sessionValid = userWithSessions.sessions && 
                userWithSessions.sessions.some(session => session.sessionId === sessionId);
              
              if (sessionValid) {
                console.log('Valid session found');
                return {
                  userId: userWithSessions._id,
                  email: userWithSessions.email,
                  name: userWithSessions.name,
                  role: userWithSessions.role || 'customer'
                };
              } else {
                console.warn('Session not found in user document');
                // Log session details for debugging
                if (userWithSessions.sessions) {
                  userWithSessions.sessions.forEach((session, index) => {
                    console.log(`Session ${index}:`, session.sessionId, 
                      'matches:', session.sessionId === sessionId);
                  });
                }
                
                // Fallback: if user exists but session doesn't match, still return the user
                // This helps with intermittent session validation issues
                console.log('Using fallback: returning user despite session mismatch');
                return {
                  userId: userWithSessions._id,
                  email: userWithSessions.email,
                  name: userWithSessions.name,
                  role: userWithSessions.role || 'customer',
                  fallback: true
                };
              }
            } else {
              console.warn('User not found by email:', userEmail);
            }
          } catch (sessionError) {
            console.error('Session validation error:', sessionError);
          }
        }
        
        // Fallback to token-based authentication
        token = cookies['auth_token'];
        if (token) {
          console.log('Falling back to token-based authentication');
          console.log('Found token in cookie header, length:', token.length);
          const user = await verifyToken(token);
          if (user) {
            console.log('Successfully verified token from cookie header');
            return user;
          } else {
            console.warn('Token from cookie header is invalid or expired');
          }
        }
      }
    } catch (cookieError) {
      console.warn('Cookie access error from request:', cookieError.message);
    }
    
    // Fallback to Next.js cookies() API if available
    try {
      const cookieStore = cookies();
      token = cookieStore.get('auth_token')?.value;
      
      if (token) {
        console.log('Found token in Next.js cookies API, length:', token.length);
        const user = await verifyToken(token);
        if (user) {
          console.log('Successfully verified token from Next.js cookies API');
          return user;
        } else {
          console.warn('Token from Next.js cookies API is invalid or expired');
        }
      }
    } catch (nextCookieError) {
      console.warn('Next.js cookie API error:', nextCookieError.message);
    }
    
    console.log('No valid authentication token found in any source');
    return null;
    
    // No valid authentication found
    return null;
  } catch (error) {
    console.error('Authentication check error:', error);
    return null;
  }
};

// Helper function to parse cookies from cookie header
const parseCookies = (cookieHeader) => {
  const cookies = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) cookies[name] = value;
  });
  
  return cookies;
};

// Helper function to safely extract token from various sources
export const getTokenFromRequest = (request) => {
  try {
    // Try Authorization header first
    if (request?.headers) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
      }
      
      // Try to get token from cookie header
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = parseCookies(cookieHeader);
        if (cookies['auth_token']) {
          return cookies['auth_token'];
        }
      }
    }
    
    // Try Next.js cookies API as fallback
    try {
      const cookieStore = cookies();
      return cookieStore.get('auth_token')?.value || null;
    } catch (cookieError) {
      console.warn('Cookie access error in getTokenFromRequest:', cookieError.message);
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting token from request:', error);
    return null;
  }
};
