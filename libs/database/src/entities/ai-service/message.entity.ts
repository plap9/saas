import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsObject,
  IsNumber,
  Length,
} from 'class-validator';
import { BaseEntity } from '../base/base.entity';
import { AiConversation } from './conversation.entity';
import { User } from '../user-service/user.entity';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  FUNCTION = 'function',
  TOOL = 'tool',
}

export enum MessageStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('ai_messages')
@Index(['conversationId'])
@Index(['role'])
@Index(['status'])
@Index(['createdAt'])
export class AiMessage extends BaseEntity {
  @Column({
    type: 'uuid',
    name: 'conversation_id',
  })
  @IsUUID()
  conversationId!: string;

  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  @IsUUID()
  userId!: string;

  @Column({
    type: 'enum',
    enum: MessageRole,
  })
  @IsEnum(MessageRole)
  role!: MessageRole;

  @Column({
    type: 'text',
  })
  @IsString()
  content!: string;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.COMPLETED,
  })
  @IsEnum(MessageStatus)
  status!: MessageStatus;

  @Column({
    type: 'integer',
    nullable: true,
    name: 'token_count',
  })
  @IsOptional()
  @IsNumber()
  tokenCount?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    model?: string;
    provider?: string;
    temperature?: number;
    finishReason?: string;
    processingTime?: number;
    inputTokens?: number;
    outputTokens?: number;
    functionCalls?: any[];
    toolCalls?: any[];
    error?: string;
  };

  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'function_call',
  })
  @IsOptional()
  @IsObject()
  functionCall?: {
    name: string;
    arguments: string;
    result?: any;
  };

  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'tool_calls',
  })
  @IsOptional()
  @IsObject()
  toolCalls?: Array<{
    id: string;
    type: string;
    function: {
      name: string;
      arguments: string;
    };
    result?: any;
  }>;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'parent_message_id',
  })
  @IsOptional()
  @IsUUID()
  parentMessageId?: string;

  @Column({
    type: 'integer',
    default: 0,
    name: 'sequence_number',
  })
  @IsNumber()
  sequenceNumber!: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'processed_at',
  })
  @IsOptional()
  processedAt?: Date;

  // Relations
  @ManyToOne(() => AiConversation, { eager: false })
  @JoinColumn({ name: 'conversation_id' })
  conversation?: AiConversation;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  // Computed properties
  get isFromUser(): boolean {
    return this.role === MessageRole.USER;
  }

  get isFromAssistant(): boolean {
    return this.role === MessageRole.ASSISTANT;
  }

  get isSystemMessage(): boolean {
    return this.role === MessageRole.SYSTEM;
  }

  get hasFunctionCall(): boolean {
    return this.functionCall !== null && this.functionCall !== undefined;
  }

  get hasToolCalls(): boolean {
    return this.toolCalls !== null && 
           this.toolCalls !== undefined && 
           this.toolCalls.length > 0;
  }

  get isProcessing(): boolean {
    return this.status === MessageStatus.PROCESSING || 
           this.status === MessageStatus.PENDING;
  }

  get isCompleted(): boolean {
    return this.status === MessageStatus.COMPLETED;
  }

  get isFailed(): boolean {
    return this.status === MessageStatus.FAILED;
  }

  get contentPreview(): string {
    return this.content.length > 100 
      ? this.content.substring(0, 100) + '...'
      : this.content;
  }
} 