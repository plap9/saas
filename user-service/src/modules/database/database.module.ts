import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from '@ai-assistant/database';
import { User, RefreshToken } from '@ai-assistant/database';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          ...dbConfig.main,
          // Override connection pool for user service
          extra: {
            ...dbConfig.main.extra,
            max: 10, // User service connection limit
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
  ],
  providers: [UserRepository, RefreshTokenRepository],
  exports: [UserRepository, RefreshTokenRepository, TypeOrmModule],
})
export class DatabaseModule {} 