import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards,
  Request,
  Get,
  Headers,
  Ip,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';

import { AuthService, LoginResponse, RefreshTokenRequest } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiBody({ type: LoginDto })
  @ApiHeader({
    name: 'User-Agent',
    description: 'Client user agent for device tracking',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string' },
          },
        },
        tokens: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'number' },
            tokenType: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string
  ): Promise<LoginResponse> {
    return this.authService.login(loginDto, userAgent, ipAddress);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'User registration',
    description: 'Create new user account',
  })
  @ApiBody({ type: RegisterDto })
  @ApiHeader({
    name: 'User-Agent',
    description: 'Client user agent for device tracking',
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string' },
          },
        },
        tokens: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'number' },
            tokenType: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string
  ): Promise<LoginResponse> {
    return this.authService.register(registerDto, userAgent, ipAddress);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Get new access token using refresh token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
      required: ['refreshToken'],
    },
  })
  @ApiHeader({
    name: 'User-Agent',
    description: 'Client user agent for device tracking',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        expiresIn: { type: 'number' },
        tokenType: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string
  ) {
    const request: RefreshTokenRequest = {
      refreshToken,
      userAgent,
      ipAddress,
    };
    return this.authService.refreshToken(request);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'User logout',
    description: 'Logout user and invalidate tokens',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
        everywhere: { type: 'boolean', description: 'Logout from all devices' },
      },
    },
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body('refreshToken') refreshToken?: string,
    @Body('everywhere') everywhere?: boolean
  ) {
    if (everywhere) {
      const revokedCount = await this.authService.revokeAllTokens(user.id);
      return { 
        message: 'Logged out from all devices successfully',
        revokedTokens: revokedCount 
      };
    } else {
      await this.authService.logout(user.id, refreshToken);
      return { message: 'Logout successful' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Get current authenticated user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { type: 'string' },
      },
    },
  })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('tokens')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get user tokens',
    description: 'Get list of active refresh tokens for current user',
  })
  @ApiResponse({
    status: 200,
    description: 'User tokens retrieved successfully',
  })
  async getUserTokens(@CurrentUser() user: AuthenticatedUser) {
    const tokens = await this.authService.getUserTokens(user.id);
    
    // Remove sensitive data before returning
    return tokens.map(token => ({
      id: token.id,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
      userAgent: token.userAgent,
      ipAddress: token.ipAddress,
      isExpired: token.isExpired,
      isRevoked: token.isRevoked,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Revoke all tokens',
    description: 'Revoke all refresh tokens for current user (logout from all devices)',
  })
  @ApiResponse({
    status: 200,
    description: 'All tokens revoked successfully',
  })
  async revokeAllTokens(@CurrentUser() user: AuthenticatedUser) {
    const revokedCount = await this.authService.revokeAllTokens(user.id);
    return { 
      message: 'All tokens revoked successfully',
      revokedTokens: revokedCount 
    };
  }
} 