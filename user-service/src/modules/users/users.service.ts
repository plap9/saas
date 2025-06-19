import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '@ai-assistant/database';
import { UserRepository, CreateUserData, UpdateUserData, FindUsersOptions } from '../database/repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Create a new user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, ...userData } = createUserDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user data
      const createData: CreateUserData = {
        email,
        passwordHash,
        ...userData,
      };

      const user = await this.userRepository.createUser(createData);

      this.logger.log(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw new BadRequestException('Failed to create user');
    }
  }

  /**
   * Find user by ID
   */
  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Find multiple users with filters
   */
  async findUsers(options: FindUsersOptions = {}): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { limit = 20, offset = 0 } = options;
    const { users, total } = await this.userRepository.findUsers(options);

    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      totalPages,
    };
  }

  /**
   * Update user
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userRepository.emailExists(updateUserDto.email, id);
      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    try {
      const updateData: UpdateUserData = { ...updateUserDto };
      const updatedUser = await this.userRepository.updateUser(id, updateData);

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User updated successfully: ${id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update user');
    }
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, newPassword: string): Promise<void> {
    // Check if user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      const success = await this.userRepository.updatePassword(id, passwordHash);
      if (!success) {
        throw new BadRequestException('Failed to update password');
      }

      this.logger.log(`Password updated successfully for user: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to update password for user ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update password');
    }
  }

  /**
   * Verify user password
   */
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    return user;
  }

  /**
   * Verify user email
   */
  async verifyEmail(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    try {
      const success = await this.userRepository.verifyEmail(id);
      if (!success) {
        throw new BadRequestException('Failed to verify email');
      }

      this.logger.log(`Email verified successfully for user: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to verify email for user ${id}: ${error.message}`);
      throw new BadRequestException('Failed to verify email');
    }
  }

  /**
   * Soft delete user
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const success = await this.userRepository.softDeleteUser(id);
      if (!success) {
        throw new BadRequestException('Failed to delete user');
      }

      this.logger.log(`User deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}: ${error.message}`);
      throw new BadRequestException('Failed to delete user');
    }
  }

  /**
   * Restore soft deleted user
   */
  async restoreUser(id: string): Promise<void> {
    try {
      const success = await this.userRepository.restoreUser(id);
      if (!success) {
        throw new NotFoundException('User not found or already active');
      }

      this.logger.log(`User restored successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to restore user ${id}: ${error.message}`);
      throw new BadRequestException('Failed to restore user');
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<{
    totalUsers: number;
    usersByStatus: Record<UserStatus, number>;
  }> {
    const usersByStatus = await this.userRepository.countUsersByStatus();
    const totalUsers = Object.values(usersByStatus).reduce((sum, count) => sum + count, 0);

    return {
      totalUsers,
      usersByStatus,
    };
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    id: string,
    preferences: Record<string, unknown>
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const success = await this.userRepository.updateUserPreferences(id, preferences);
      if (!success) {
        throw new BadRequestException('Failed to update preferences');
      }

      this.logger.log(`User preferences updated successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to update preferences for user ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update preferences');
    }
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(id: string): Promise<Record<string, unknown>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const preferences = await this.userRepository.getUserPreferences(id);
    return preferences || {};
  }
} 