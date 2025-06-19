import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InitialSchema1703750000000 implements MigrationInterface {
  name = 'InitialSchema1703750000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['admin', 'manager', 'user'],
            default: "'user'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'suspended', 'pending_verification'],
            default: "'pending_verification'",
          },
          {
            name: 'avatar_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'language',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'email_verified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'last_login_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'email_verified_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'preferences',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create AI conversations table
    await queryRunner.createTable(
      new Table({
        name: 'ai_conversations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'session_id',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['chat', 'task_automation', 'knowledge_query', 'integration'],
            default: "'chat'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'archived', 'deleted', 'paused'],
            default: "'active'",
          },
          {
            name: 'context',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'model_config',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'last_message_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'message_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'total_tokens',
            type: 'integer',
            default: 0,
          },
          {
            name: 'total_cost',
            type: 'decimal',
            precision: 10,
            scale: 6,
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true
    );

    // Create AI messages table
    await queryRunner.createTable(
      new Table({
        name: 'ai_messages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'conversation_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['user', 'assistant', 'system', 'function', 'tool'],
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
            default: "'completed'",
          },
          {
            name: 'token_count',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'cost',
            type: 'decimal',
            precision: 10,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'function_call',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'tool_calls',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'parent_message_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'sequence_number',
            type: 'integer',
            default: 0,
          },
          {
            name: 'processed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['conversation_id'],
            referencedTableName: 'ai_conversations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true
    );

    // Create indexes for performance
    await queryRunner.createIndex('users', new TableIndex({ name: 'idx_users_email', columnNames: ['email'] }));
    await queryRunner.createIndex('users', new TableIndex({ name: 'idx_users_status', columnNames: ['status'] }));
    await queryRunner.createIndex('users', new TableIndex({ name: 'idx_users_role', columnNames: ['role'] }));
    
    await queryRunner.createIndex('ai_conversations', new TableIndex({ name: 'idx_conversations_user_id', columnNames: ['user_id'] }));
    await queryRunner.createIndex('ai_conversations', new TableIndex({ name: 'idx_conversations_status', columnNames: ['status'] }));
    await queryRunner.createIndex('ai_conversations', new TableIndex({ name: 'idx_conversations_type', columnNames: ['type'] }));
    await queryRunner.createIndex('ai_conversations', new TableIndex({ name: 'idx_conversations_session', columnNames: ['session_id'] }));
    await queryRunner.createIndex('ai_conversations', new TableIndex({ name: 'idx_conversations_last_message', columnNames: ['last_message_at'] }));
    
    await queryRunner.createIndex('ai_messages', new TableIndex({ name: 'idx_messages_conversation_id', columnNames: ['conversation_id'] }));
    await queryRunner.createIndex('ai_messages', new TableIndex({ name: 'idx_messages_role', columnNames: ['role'] }));
    await queryRunner.createIndex('ai_messages', new TableIndex({ name: 'idx_messages_status', columnNames: ['status'] }));
    await queryRunner.createIndex('ai_messages', new TableIndex({ name: 'idx_messages_created_at', columnNames: ['created_at'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ai_messages');
    await queryRunner.dropTable('ai_conversations');
    await queryRunner.dropTable('users');
  }
} 