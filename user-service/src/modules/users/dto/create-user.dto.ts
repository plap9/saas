import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from '@ai-assistant/database';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 255)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
    }
  )
  password!: string;

  @IsString()
  @Length(1, 100)
  firstName!: string;

  @IsString()
  @Length(1, 100)
  lastName!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  timezone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  language?: string;

  @IsOptional()
  @IsObject()
  preferences?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
} 