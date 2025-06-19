import {
  Entity,
  Column,
  Index,
} from 'typeorm';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDate,
  Length,
} from 'class-validator';
import { BaseEntity } from '../base/base.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['status'])
@Index(['role'])
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  @IsEmail()
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'password_hash',
  })
  @IsString()
  @Length(8, 255)
  passwordHash!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'first_name',
  })
  @IsString()
  @Length(1, 100)
  firstName!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'last_name',
  })
  @IsString()
  @Length(1, 100)
  lastName!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  @IsEnum(UserStatus)
  status!: UserStatus;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'avatar_url',
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  avatarUrl?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'phone_number',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @Column({
    type: 'boolean',
    default: true,
    name: 'is_active',
  })
  @IsBoolean()
  isActive!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'email_verified',
  })
  @IsBoolean()
  emailVerified!: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'last_login_at',
  })
  @IsOptional()
  @IsDate()
  lastLoginAt?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'email_verified_at',
  })
  @IsOptional()
  @IsDate()
  emailVerifiedAt?: Date;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  @IsOptional()
  preferences?: Record<string, unknown>;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  @IsOptional()
  metadata?: Record<string, unknown>;

  // Computed properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isEmailVerified(): boolean {
    return this.emailVerified && this.emailVerifiedAt !== null;
  }

  get canLogin(): boolean {
    return this.isActive && 
           this.status === UserStatus.ACTIVE && 
           this.isEmailVerified;
  }
} 