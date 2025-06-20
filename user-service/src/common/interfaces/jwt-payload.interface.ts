export interface JwtPayload {
  /**
   * Subject - User ID
   */
  sub: string;
  
  /**
   * User email
   */
  email: string;
  
  /**
   * Issued at timestamp
   */
  iat?: number;
  
  /**
   * Expiration timestamp
   */
  exp?: number;
  
  /**
   * Token type (access_token, refresh_token)
   */
  type?: 'access_token' | 'refresh_token';
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
} 