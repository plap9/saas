import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  IsString,
  IsDate,
  IsOptional,
  IsIP,
  Length,
} from 'class-validator';
import { BaseEntity } from '../base/base.entity';
import { User } from './user.entity';

@Entity('refresh_tokens')
@Index(['userId'])
@Index(['expiresAt'])
@Index(['tokenHash'], { unique: true })
export class RefreshToken extends BaseEntity {
  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'token_hash',
    unique: true,
  })
  @IsString()
  @Length(1, 255)
  tokenHash!: string;

  @Column({
    type: 'timestamp',
    name: 'expires_at',
  })
  @IsDate()
  expiresAt!: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'revoked_at',
  })
  @IsOptional()
  @IsDate()
  revokedAt?: Date;

  @Column({
    type: 'text',
    nullable: true,
    name: 'user_agent',
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @Column({
    type: 'inet',
    nullable: true,
    name: 'ip_address',
  })
  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'device_fingerprint',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  deviceFingerprint?: string;

  // Computed properties
  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  get isRevoked(): boolean {
    return this.revokedAt !== null && this.revokedAt !== undefined;
  }

  get isValid(): boolean {
    return !this.isExpired && !this.isRevoked;
  }

  // Methods
  revoke(): void {
    this.revokedAt = new Date();
  }

  isOwnedBy(userId: string): boolean {
    return this.userId === userId;
  }
} 