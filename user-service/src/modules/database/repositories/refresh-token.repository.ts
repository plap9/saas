import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, DeleteResult } from 'typeorm';
import { RefreshToken } from '@ai-assistant/database';

export interface CreateRefreshTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  deviceFingerprint?: string;
}

export interface FindTokensOptions {
  userId?: string;
  isExpired?: boolean;
  isRevoked?: boolean;
  limit?: number;
  offset?: number;
}

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /**
   * Create new refresh token
   */
  async createToken(data: CreateRefreshTokenData): Promise<RefreshToken> {
    const token = this.refreshTokenRepository.create(data);
    return await this.refreshTokenRepository.save(token);
  }

  /**
   * Find token by hash
   */
  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({
      where: { tokenHash },
      relations: ['user'],
    });
  }

  /**
   * Find token by ID
   */
  async findById(id: string): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  /**
   * Find tokens for a user
   */
  async findUserTokens(
    userId: string,
    options: FindTokensOptions = {}
  ): Promise<RefreshToken[]> {
    const { limit = 10, offset = 0 } = options;
    
    const queryBuilder = this.refreshTokenRepository
      .createQueryBuilder('token')
      .where('token.userId = :userId', { userId })
      .orderBy('token.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (options.isExpired !== undefined) {
      if (options.isExpired) {
        queryBuilder.andWhere('token.expiresAt < :now', { now: new Date() });
      } else {
        queryBuilder.andWhere('token.expiresAt >= :now', { now: new Date() });
      }
    }

    if (options.isRevoked !== undefined) {
      if (options.isRevoked) {
        queryBuilder.andWhere('token.revokedAt IS NOT NULL');
      } else {
        queryBuilder.andWhere('token.revokedAt IS NULL');
      }
    }

    return await queryBuilder.getMany();
  }

  /**
   * Revoke token by hash
   */
  async revokeToken(tokenHash: string): Promise<boolean> {
    const result = await this.refreshTokenRepository.update(
      { tokenHash },
      { revokedAt: new Date() }
    );
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * Revoke token by ID
   */
  async revokeTokenById(id: string): Promise<boolean> {
    const result = await this.refreshTokenRepository.update(
      { id },
      { revokedAt: new Date() }
    );
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * Revoke all tokens for user
   */
  async revokeAllUserTokens(userId: string): Promise<number> {
    const result = await this.refreshTokenRepository.update(
      { userId, revokedAt: null },
      { revokedAt: new Date() }
    );
    return result.affected || 0;
  }

  /**
   * Delete expired tokens
   */
  async deleteExpiredTokens(): Promise<number> {
    const result: DeleteResult = await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
    return result.affected || 0;
  }

  /**
   * Delete revoked tokens older than specified days
   */
  async deleteOldRevokedTokens(daysOld = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result: DeleteResult = await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where('revokedAt IS NOT NULL')
      .andWhere('revokedAt < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }

  /**
   * Get valid tokens count for user
   */
  async getValidTokensCount(userId: string): Promise<number> {
    return await this.refreshTokenRepository.count({
      where: {
        userId,
        revokedAt: null,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  /**
   * Check if token exists and is valid
   */
  async isTokenValid(tokenHash: string): Promise<boolean> {
    const token = await this.refreshTokenRepository.findOne({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: MoreThan(new Date()),
      },
    });
    return token !== null;
  }

  /**
   * Clean up tokens (expired and old revoked)
   */
  async cleanupTokens(revokedTokensRetentionDays = 30): Promise<{
    expiredDeleted: number;
    oldRevokedDeleted: number;
  }> {
    const [expiredDeleted, oldRevokedDeleted] = await Promise.all([
      this.deleteExpiredTokens(),
      this.deleteOldRevokedTokens(revokedTokensRetentionDays),
    ]);

    return {
      expiredDeleted,
      oldRevokedDeleted,
    };
  }

  /**
   * Get token statistics for user
   */
  async getUserTokenStats(userId: string): Promise<{
    total: number;
    valid: number;
    expired: number;
    revoked: number;
  }> {
    const [total, valid, expired, revoked] = await Promise.all([
      this.refreshTokenRepository.count({ where: { userId } }),
      this.refreshTokenRepository.count({
        where: {
          userId,
          revokedAt: null,
          expiresAt: MoreThan(new Date()),
        },
      }),
      this.refreshTokenRepository.count({
        where: {
          userId,
          expiresAt: LessThan(new Date()),
        },
      }),
      this.refreshTokenRepository.count({
        where: {
          userId,
          revokedAt: MoreThan(new Date(0)), // Any non-null date
        },
      }),
    ]);

    return { total, valid, expired, revoked };
  }
} 