import * as jose from 'jose';
import { cookies } from 'next/headers';

// Secret key for JWT - convert to Uint8Array for jose
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_this';
const secretKey = new TextEncoder().encode(JWT_SECRET);

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
    
    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    
    return payload;
  } catch (error) {
    // Handle different types of JWT errors
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.warn('Token expired:', error.message);
    } else if (error.code === 'ERR_JWS_INVALID') {
      console.warn('Invalid token:', error.message);
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
    
    try {
      const cookieStore = cookies();
      token = cookieStore.get('auth_token')?.value;
    } catch (cookieError) {
      console.warn('Cookie access not available:', cookieError.message);
      // Return null in environments where cookies() is not available
      return null;
    }
    
    if (!token) {
      return null;
    }
    
    return await verifyToken(token);
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
    // First try to get token from Authorization header
    if (request?.headers) {
      try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          const user = await verifyToken(token);
          if (user) return user;
        }
      } catch (headerError) {
        console.warn('Error accessing request headers:', headerError.message);
      }
    }
    
    // If header token failed or wasn't present, try cookies
    try {
      const cookieStore = cookies();
      const token = cookieStore.get('auth_token')?.value;
      
      if (token) {
        return await verifyToken(token);
      }
    } catch (cookieError) {
      console.warn('Cookie access error:', cookieError.message);
    }
    
    // No valid authentication found
    return null;
  } catch (error) {
    console.error('Authentication check error:', error);
    return null;
  }
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
    }
    
    // Try cookies next
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
