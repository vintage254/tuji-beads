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
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

/**
 * Get the current user from the request cookies
 * @returns {Object|null} User data from token or null if not authenticated
 */
export const getCurrentUser = () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    
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
    // Check for token in Authorization header
    const authHeader = request?.headers?.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      return verifyToken(token);
    }
    
    // Check for token in cookies
    try {
      const cookieStore = cookies();
      const token = cookieStore.get('auth_token')?.value;
      
      if (!token) {
        return null;
      }
      
      return verifyToken(token);
    } catch (cookieError) {
      console.error('Cookie access error:', cookieError);
      return null;
    }
  } catch (error) {
    console.error('Authentication check error:', error);
    return null;
  }
};
