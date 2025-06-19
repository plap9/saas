// Base entities
export * from './base/base.entity';

// User service entities
export * from './user-service';

// AI service entities
export * from './ai-service';

// All entities array for TypeORM configuration
import { User } from './user-service/user.entity';
import { AiConversation } from './ai-service/conversation.entity';
import { AiMessage } from './ai-service/message.entity';

export const ALL_ENTITIES = [
  User,
  AiConversation,
  AiMessage,
] as const;

export type EntityType = typeof ALL_ENTITIES[number]; 