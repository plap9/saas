export * from './conversation.entity';
export * from './message.entity';

// Re-export enums for convenience
export {
  ConversationStatus,
  ConversationType,
} from './conversation.entity';

export {
  MessageRole,
  MessageStatus,
} from './message.entity'; 