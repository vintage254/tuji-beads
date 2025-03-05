import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_this';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export const generateToken = (user, expiresIn = '7d') => {
  try {
    if (!user || !user._id) {
      console.error('Invalid user object provided for token generation');
      return '';
    }
    
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role || 'customer',
      },
      JWT_SECRET,
      { expiresIn }
    );
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
export const verifyToken = (token) => {
  try {
    if (!token) {
      console.warn('No token provided for verification');
      return null;
    }
    
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Handle different types of JWT errors
    if (error.name === 'TokenExpiredError') {
      console.warn('Token expired:', error.message);
    } else if (error.name === 'JsonWebTokenError') {
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
export const getCurrentUser = () => {
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
    
    return verifyToken(token);
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
export const isAuthenticated = (request) => {
  try {
    // First try to get token from Authorization header
    if (request?.headers) {
      try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          const user = verifyToken(token);
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
        return verifyToken(token);
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
