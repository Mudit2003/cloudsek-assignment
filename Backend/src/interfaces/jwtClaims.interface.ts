export default interface JWTClaims {
    sub: string;           // Subject (user ID)
    email: string;         // User email
    username: string;      // Username
    roles?: string[];      // Optional: User roles (e.g., 'admin', 'user')
    iat: number;           // Issued at (timestamp)
    exp: number;           // Expiration time (timestamp)
    jti: string;           // JWT ID for token identification
  }
  