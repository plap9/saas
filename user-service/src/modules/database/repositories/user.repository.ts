import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User, UserStatus, UserRole } from '@ai-assistant/database';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  status?: UserStatus;
  avatarUrl?: string;
  phoneNumber?: string;
  timezone?: string;
  language?: string;
  preferences?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  avatarUrl?: string;
  phoneNumber?: string;
  timezone?: string;
  language?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  preferences?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
}

export interface FindUsersOptions {
  role?: UserRole;
  status?: UserStatus;
  isActive?: boolean;
  emailVerified?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData): Promise<User> {
    const user = this.userRepository.create({
      ...userData,
      role: userData.role || UserRole.USER,
      status: userData.status || UserStatus.PENDING_VERIFICATION,
      isActive: true,
      emailVerified: false,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Find multiple users with filters
   */
  async findUsers(options: FindUsersOptions = {}): Promise<{
    users: User[];
    total: number;
  }> {
    const {
      role,
      status,
      isActive,
      emailVerified,
      limit = 20,
      offset = 0,
      search,
    } = options;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Apply filters
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    if (emailVerified !== undefined) {
      queryBuilder.andWhere('user.emailVerified = :emailVerified', { emailVerified });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    // Apply pagination
    queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    const [users, total] = await queryBuilder.getManyAndCount();

    return { users, total };
  }

  /**
   * Update user by ID
   */
  async updateUser(id: string, updateData: UpdateUserData): Promise<User | null> {
    const updateResult: UpdateResult = await this.userRepository.update(
      { id },
      updateData
    );

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    const updateResult: UpdateResult = await this.userRepository.update(
      { id },
      { passwordHash }
    );

    return (updateResult.affected ?? 0) > 0;
  }

  /**
   * Update user login timestamp
   */
  async updateLastLogin(id: string): Promise<boolean> {
    const updateResult: UpdateResult = await this.userRepository.update(
      { id },
      { lastLoginAt: new Date() }
    );

    return (updateResult.affected ?? 0) > 0;
  }

  /**
   * Verify user email
   */
  async verifyEmail(id: string): Promise<boolean> {
    const updateResult: UpdateResult = await this.userRepository.update(
      { id },
      {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        status: UserStatus.ACTIVE,
      }
    );

    return (updateResult.affected ?? 0) > 0;
  }

  /**
   * Soft delete user
   */
  async softDeleteUser(id: string): Promise<boolean> {
    const deleteResult: DeleteResult = await this.userRepository.softDelete(id);
    return (deleteResult.affected ?? 0) > 0;
  }

  /**
   * Restore soft deleted user
   */
  async restoreUser(id: string): Promise<boolean> {
    const restoreResult = await this.userRepository.restore(id);
    return (restoreResult.affected ?? 0) > 0;
  }

  /**
   * Hard delete user (permanent)
   */
  async deleteUser(id: string): Promise<boolean> {
    const deleteResult: DeleteResult = await this.userRepository.delete(id);
    return (deleteResult.affected ?? 0) > 0;
  }

  /**
   * Count users by status
   */
  async countUsersByStatus(): Promise<Record<UserStatus, number>> {
    const counts = await this.userRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.status')
      .getRawMany();

    const result: Record<string, number> = {};
    
    // Initialize all statuses with 0
    Object.values(UserStatus).forEach(status => {
      result[status] = 0;
    });

    // Update with actual counts
    counts.forEach(({ status, count }) => {
      result[status] = parseInt(count, 10);
    });

    return result as Record<UserStatus, number>;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    if (excludeId) {
      const count = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .andWhere('user.id != :excludeId', { excludeId })
        .getCount();
      return count > 0;
    }

    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(id: string): Promise<Record<string, unknown> | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['preferences'],
    });

    return user?.preferences || null;
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    id: string,
    preferences: Record<string, unknown>
  ): Promise<boolean> {
    const updateResult: UpdateResult = await this.userRepository.update(
      { id },
      { preferences }
    );

    return (updateResult.affected ?? 0) > 0;
  }
} 