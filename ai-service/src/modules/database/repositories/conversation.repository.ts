import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { AiConversation, ConversationStatus, ConversationType } from '@ai-assistant/database';

export interface CreateConversationData {
  userId: string;
  sessionId: string;
  title?: string;
  type?: ConversationType;
  status?: ConversationStatus;
  context?: Record<string, unknown>;
  modelConfig?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UpdateConversationData {
  title?: string;
  status?: ConversationStatus;
  context?: Record<string, unknown>;
  modelConfig?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  lastMessageAt?: Date;
  totalTokens?: number;
  totalCost?: number;
}

export interface FindConversationsOptions {
  userId?: string;
  sessionId?: string;
  status?: ConversationStatus;
  type?: ConversationType;
  limit?: number;
  offset?: number;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectRepository(AiConversation)
    private readonly conversationRepository: Repository<AiConversation>,
  ) {}

  async createConversation(conversationData: CreateConversationData): Promise<AiConversation> {
    const conversation = this.conversationRepository.create({
      ...conversationData,
      type: conversationData.type || ConversationType.CHAT,
      status: conversationData.status || ConversationStatus.ACTIVE,
      totalTokens: 0,
      totalCost: 0,
      lastMessageAt: new Date(),
    });

    return await this.conversationRepository.save(conversation);
  }

  async findById(id: string): Promise<AiConversation | null> {
    return await this.conversationRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<AiConversation[]> {
    return await this.conversationRepository.find({
      where: { userId },
      order: { lastMessageAt: 'DESC' },
      relations: ['user'],
    });
  }

  async updateConversation(id: string, updateData: UpdateConversationData): Promise<AiConversation | null> {
    const updateResult: UpdateResult = await this.conversationRepository.update(
      { id },
      updateData
    );

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }
} 