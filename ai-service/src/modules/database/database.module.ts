import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from '@ai-assistant/database';
import { AiConversation, AiMessage, User } from '@ai-assistant/database';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          ...dbConfig.main,
          // Override connection pool for AI service (higher workload)
          extra: {
            ...dbConfig.main.extra,
            max: 15, // AI service connection limit
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([AiConversation, AiMessage, User]),
  ],
  providers: [ConversationRepository, MessageRepository],
  exports: [ConversationRepository, MessageRepository, TypeOrmModule],
})
export class DatabaseModule {} 