export default interface JWTClaims {
    sub: string;           // Subject (user ID)
    email: string;         // User email
    username: string;      // Username
    iat: number;           // Issued at (timestamp)
    exp: number;           // Expiration time (timestamp)
    jti: string;           // JWT ID for token identification
  }
  