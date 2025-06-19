import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
  main: TypeOrmModuleOptions;
  audit: TypeOrmModuleOptions;
  cache: TypeOrmModuleOptions;
}

export const databaseConfig = registerAs('database', (): DatabaseConfig => {
  const baseConfig = {
    type: 'postgres' as const,
    host: process.env['POSTGRES_HOST'] || 'localhost',
    port: parseInt(process.env['POSTGRES_PORT'] || '5432', 10),
    username: process.env['POSTGRES_USER'] || 'postgres',
    password: process.env['POSTGRES_PASSWORD'],
    synchronize: false, // Always false in production
    logging: process.env['NODE_ENV'] === 'development',
    ssl: process.env['POSTGRES_SSL_MODE'] === 'require' 
      ? { rejectUnauthorized: false } 
      : false,
    extra: {
      max: parseInt(process.env['MAX_CONNECTIONS_PER_SERVICE'] || '10', 10),
      connectionTimeoutMillis: parseInt(process.env['CONNECTION_TIMEOUT'] || '30000', 10),
      idleTimeoutMillis: parseInt(process.env['IDLE_TIMEOUT'] || '10000', 10),
    },
  };

  return {
    // Main database cho business data
    main: {
      ...baseConfig,
      name: 'main',
      database: process.env['POSTGRES_DB'] || 'ai_assistant_main',
      entities: [
        __dirname + '/../entities/**/*.entity{.ts,.js}',
      ],
      migrations: [
        __dirname + '/../migrations/*{.ts,.js}',
      ],
      migrationsTableName: 'migrations',
      migrationsRun: process.env['NODE_ENV'] !== 'production',
    },

    // Audit database cho audit logs
    audit: {
      ...baseConfig,
      name: 'audit',
      database: process.env['POSTGRES_AUDIT_DB'] || 'ai_assistant_audit',
      entities: [
        __dirname + '/../entities/audit/**/*.entity{.ts,.js}',
      ],
      migrations: [
        __dirname + '/../migrations/audit/*{.ts,.js}',
      ],
      migrationsTableName: 'audit_migrations',
    },

    // Cache database cho temporary data
    cache: {
      ...baseConfig,
      name: 'cache',
      database: process.env['POSTGRES_CACHE_DB'] || 'ai_assistant_cache',
      entities: [
        __dirname + '/../entities/cache/**/*.entity{.ts,.js}',
      ],
      migrations: [
        __dirname + '/../migrations/cache/*{.ts,.js}',
      ],
      migrationsTableName: 'cache_migrations',
    },
  };
});

export default databaseConfig; 