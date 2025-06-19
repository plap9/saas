import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { AiMessage, MessageRole, MessageStatus } from '@ai-assistant/database';

export interface CreateMessageData {
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
  parentMessageId?: string;
  functionCall?: Record<string, unknown>;
  toolCalls?: Record<string, unknown>[];
  status?: MessageStatus;
}

export interface UpdateMessageData {
  content?: string;
  status?: MessageStatus;
  metadata?: Record<string, unknown>;
  functionCall?: Record<string, unknown>;
  toolCalls?: Record<string, unknown>[];
  tokens?: number;
  cost?: number;
}

export interface FindMessagesOptions {
  conversationId?: string;
  role?: MessageRole;
  status?: MessageStatus;
  limit?: number;
  offset?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(AiMessage)
    private readonly messageRepository: Repository<AiMessage>,
  ) {}

  async createMessage(messageData: CreateMessageData): Promise<AiMessage> {
    const message = this.messageRepository.create({
      ...messageData,
      status: messageData.status || MessageStatus.COMPLETED,
      tokenCount: 0,
      cost: 0,
      sequenceNumber: 0,
    });

    return await this.messageRepository.save(message);
  }

  async createMessages(messagesData: CreateMessageData[]): Promise<AiMessage[]> {
    const messages = messagesData.map((data, index) => 
      this.messageRepository.create({
        ...data,
        status: data.status || MessageStatus.COMPLETED,
        tokenCount: 0,
        cost: 0,
        sequenceNumber: index,
      })
    );

    return await this.messageRepository.save(messages);
  }

  async findById(id: string): Promise<AiMessage | null> {
    return await this.messageRepository.findOne({
      where: { id },
      relations: ['conversation'],
    });
  }

  async findByConversationId(conversationId: string): Promise<AiMessage[]> {
    return await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      relations: ['conversation'],
    });
  }

  async updateMessage(id: string, updateData: UpdateMessageData): Promise<AiMessage | null> {
    const updateResult: UpdateResult = await this.messageRepository.update(
      { id },
      updateData
    );

    if (updateResult.affected === 0) {
      return null;
    }

    return await this.findById(id);
  }

  async deleteMessage(id: string): Promise<boolean> {
    const deleteResult: DeleteResult = await this.messageRepository.softDelete(id);
    return (deleteResult.affected ?? 0) > 0;
  }
} 