// Centralized JWT configuration to ensure consistency

// Get JWT secret from environment or use fallback
const JWT_SECRET = process.env.JWT_SECRET || 'tuji_beads_secure_jwt_secret_key';

// Export the secret to be used consistently across the application
export const getJwtSecret = () => JWT_SECRET;

// Create a TextEncoder once for efficiency
const encoder = new TextEncoder();

// Get the secret key as Uint8Array for jose
export const getSecretKey = () => {
  return encoder.encode(JWT_SECRET);
};

// Log JWT configuration on module load (safely)
console.log('JWT Config loaded');
console.log('JWT_SECRET configured:', !!JWT_SECRET);
console.log('JWT_SECRET length:', JWT_SECRET.length);
console.log('Using default secret:', JWT_SECRET === 'tuji_beads_secure_jwt_secret_key');
