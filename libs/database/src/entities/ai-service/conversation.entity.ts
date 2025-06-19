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
  IsArray,
  IsObject,
  Length,
} from 'class-validator';
import { BaseEntity } from '../base/base.entity';
import { User } from '../user-service/user.entity';

export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  PAUSED = 'paused',
}

export enum ConversationType {
  CHAT = 'chat',
  TASK_AUTOMATION = 'task_automation',
  KNOWLEDGE_QUERY = 'knowledge_query',
  INTEGRATION = 'integration',
}

@Entity('ai_conversations')
@Index(['userId'])
@Index(['status'])
@Index(['type'])
@Index(['sessionId'])
@Index(['lastMessageAt'])
export class AiConversation extends BaseEntity {
  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  @IsUUID()
  userId!: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'session_id',
  })
  @IsString()
  @Length(1, 255)
  sessionId!: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  title?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.CHAT,
  })
  @IsEnum(ConversationType)
  type!: ConversationType;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.ACTIVE,
  })
  @IsEnum(ConversationStatus)
  status!: ConversationStatus;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  context?: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    model?: string;
    tools?: string[];
    knowledgeBaseSources?: string[];
  };

  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'model_config',
  })
  @IsOptional()
  @IsObject()
  modelConfig?: {
    provider: string;
    model: string;
    temperature: number;
    maxTokens: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    source?: string;
    userAgent?: string;
    ip?: string;
    integrationId?: string;
    parentConversationId?: string;
  };

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'last_message_at',
  })
  @IsOptional()
  lastMessageAt?: Date;

  @Column({
    type: 'integer',
    default: 0,
    name: 'message_count',
  })
  messageCount!: number;

  @Column({
    type: 'integer',
    default: 0,
    name: 'total_tokens',
  })
  totalTokens!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    default: 0,
    name: 'total_cost',
  })
  totalCost!: number;

  // Relations
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  // Computed properties
  get isActive(): boolean {
    return this.status === ConversationStatus.ACTIVE;
  }

  get hasContext(): boolean {
    return this.context !== null && Object.keys(this.context || {}).length > 0;
  }

  get averageTokensPerMessage(): number {
    return this.messageCount > 0 ? this.totalTokens / this.messageCount : 0;
  }
} 