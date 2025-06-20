import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import { UsersService } from '../../users/users.service';
import { PasswordService } from './password.service';
import { RefreshTokenRepository } from '../../database/repositories/refresh-token.repository';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  /**
   * User login with email and password
   */
  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ipAddress?: string
  ): Promise<LoginResponse> {
    const { email, password } = loginDto;

    try {
      // Verify user credentials
      const user = await this.usersService.verifyPassword(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens with device tracking
      const tokens = await this.generateTokens(user.id, user.email, userAgent, ipAddress);

      this.logger.log(`User logged in successfully: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        tokens,
      };
    } catch (error) {
      this.logger.error(`Login failed for ${email}: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed');
    }
  }

  /**
   * User registration
   */
  async register(
    registerDto: RegisterDto,
    userAgent?: string,
    ipAddress?: string
  ): Promise<LoginResponse> {
    try {
      // Create user
      const user = await this.usersService.createUser(registerDto);

      // Generate tokens with device tracking
      const tokens = await this.generateTokens(user.id, user.email, userAgent, ipAddress);

      this.logger.log(`User registered successfully: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        tokens,
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate access and refresh tokens with persistence
   */
  async generateTokens(
    userId: string,
    email: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const accessPayload: JwtPayload = {
      sub: userId,
      email,
      type: 'access_token',
    };

    const refreshPayload: JwtPayload = {
      sub: userId,
      email,
      type: 'refresh_token',
    };

    const expiresIn = this.getAccessTokenExpiry();
    const refreshExpiresIn = this.getRefreshTokenExpiry();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    // Store refresh token in database
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + refreshExpiresIn * 1000);
    
    await this.refreshTokenRepository.createToken({
      userId,
      tokenHash,
      expiresAt,
      userAgent,
      ipAddress,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<AuthTokens> {
    const { refreshToken, userAgent, ipAddress } = request;

    try {
      // Verify refresh token signature
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check if token exists in database and is valid
      const tokenHash = this.hashToken(refreshToken);
      const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);
      
      if (!storedToken || !storedToken.isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Validate user still exists and is active
      const user = await this.usersService.findUserById(payload.sub);
      if (!user || !user.canLogin) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Revoke old token
      await this.refreshTokenRepository.revokeToken(tokenHash);

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email, userAgent, ipAddress);

      this.logger.log(`Token refreshed for user: ${user.email}`);
      return tokens;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Validate access token
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Logout user and revoke refresh token
   */
  async logout(userId: string, refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        await this.refreshTokenRepository.revokeToken(tokenHash);
      } else {
        // Revoke all tokens for user
        await this.refreshTokenRepository.revokeAllUserTokens(userId);
      }

      this.logger.log(`User logged out: ${userId}`);
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`);
      // Don't throw error for logout
    }
  }

  /**
   * Revoke all tokens for user (force logout from all devices)
   */
  async revokeAllTokens(userId: string): Promise<number> {
    return await this.refreshTokenRepository.revokeAllUserTokens(userId);
  }

  /**
   * Get user's active tokens
   */
  async getUserTokens(userId: string) {
    return await this.refreshTokenRepository.findUserTokens(userId, {
      isRevoked: false,
      isExpired: false,
    });
  }

  /**
   * Cleanup expired and revoked tokens
   */
  async cleanupTokens(): Promise<{ expiredDeleted: number; oldRevokedDeleted: number }> {
    return await this.refreshTokenRepository.cleanupTokens();
  }

  // Private helper methods
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private getAccessTokenExpiry(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '15m');
    return this.parseTimeToSeconds(expiresIn);
  }

  private getRefreshTokenExpiry(): number {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    return this.parseTimeToSeconds(expiresIn);
  }

  private parseTimeToSeconds(timeString: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = timeString.match(regex);
    
    if (!match) {
      throw new Error(`Invalid time format: ${timeString}`);
    }

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case 's': return numValue;
      case 'm': return numValue * 60;
      case 'h': return numValue * 60 * 60;
      case 'd': return numValue * 60 * 60 * 24;
      default: throw new Error(`Unknown time unit: ${unit}`);
    }
  }
} 