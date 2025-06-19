# AI Assistant Platform - Database Infrastructure

Hệ thống database infrastructure cho AI Assistant Platform bao gồm PostgreSQL, Redis, và Weaviate vector database.

## 🏗️ Kiến Trúc

```
Database Infrastructure:
├── PostgreSQL 15 + pgvector    # Primary database với AI vector support
├── Redis 7                     # Cache và session management  
├── Weaviate                    # Vector database cho embeddings
├── PgAdmin                     # PostgreSQL management (dev only)
└── Redis Commander             # Redis management (dev only)
```

## 🚀 Quick Start

### 1. Chuẩn Bị Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file với credentials và API keys của bạn
notepad .env  # Trên Windows
# hoặc
code .env     # Với VS Code

# ⚠️ QUAN TRỌNG: Cập nhật các giá trị sau trong .env:
# POSTGRES_PASSWORD=your-secure-password
# WEAVIATE_API_KEY=your-weaviate-key  
# OPENAI_API_KEY=your-openai-api-key
```

### 2. Start Database Stack

```bash
# Start tất cả database services
docker-compose up -d

# Hoặc start với development tools
docker-compose --profile development up -d

# Check status
docker-compose ps
```

### 3. Verify Installation

```bash
# PostgreSQL health check
docker exec postgres-ai psql -U postgres -d ai_assistant_main -c "SELECT version();"

# Redis health check
docker exec redis-ai redis-cli ping

# Weaviate health check
curl http://localhost:8080/v1/meta
```

## 📋 Services Overview

### PostgreSQL Database
- **Port**: 5432
- **Databases**: 
  - `ai_assistant_main` - Primary business data
  - `ai_assistant_audit` - Audit logs
  - `ai_assistant_cache` - Local cache tables
- **Extensions**: pgvector, uuid-ossp, pg_stat_statements
- **Management**: PgAdmin tại http://localhost:5050

### Redis Cache
- **Port**: 6379
- **Configuration**: Optimized cho AI workloads
- **Persistence**: RDB + AOF enabled
- **Management**: Redis Commander tại http://localhost:8081

### Weaviate Vector DB
- **Port**: 8080
- **Modules**: text2vec-openai, generative-openai
- **Authentication**: API key based
- **API Docs**: http://localhost:8080/v1/meta

## 🔧 Configuration

### Environment Variables

Key environment variables trong `.env`:

```bash
# Database Configuration
POSTGRES_DB=ai_assistant_main
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_MULTIPLE_DATABASES=ai_assistant_audit,ai_assistant_cache

# Cache Configuration  
REDIS_PASSWORD=your-redis-password-here

# Vector Database
WEAVIATE_API_KEY=your-weaviate-key-here
WEAVIATE_ADMIN_USER=admin@ai-assistant.com

# AI Integration
OPENAI_API_KEY=your-openai-api-key-here

# Development Tools
PGADMIN_EMAIL=admin@ai-assistant.com
PGADMIN_PASSWORD=admin-password-here
```

**🔒 Bảo Mật Quan Trọng:**
- File `.env` chứa thông tin nhạy cảm - **KHÔNG BAO GIỜ** commit lên Git
- File `.env` đã được thêm vào `.gitignore` để bảo vệ
- Sử dụng mật khẩu mạnh cho production environment
- Thay đổi tất cả default passwords trước khi deploy

### Performance Tuning

PostgreSQL được tối ưu cho:
- AI vector operations với pgvector
- SSD storage với random_page_cost=1.1
- Memory allocation: 256MB shared_buffers, 1GB effective_cache_size

Redis được tối ưu cho:
- Session management
- AI response caching
- Real-time data

## 🗄️ Database Schema

### PostgreSQL Schemas

```sql
-- Main Database Schemas
ai_assistant_main:
├── users           # User management
├── conversations   # AI conversations
├── knowledge       # Knowledge base
├── integrations    # Third-party integrations
└── analytics       # Usage analytics
```

### Weaviate Classes

```yaml
Vector Database Classes:
├── Document        # Knowledge base documents
├── Conversation    # AI conversation context  
└── UserProfile     # User preferences
```

## 📊 Monitoring

### Health Checks

```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs postgresql
docker-compose logs redis
docker-compose logs weaviate

# Monitor performance
docker stats postgres-ai redis-ai weaviate-ai
```

### Performance Monitoring

- **PostgreSQL**: pg_stat_statements enabled
- **Redis**: SLOWLOG và latency monitoring
- **Weaviate**: Prometheus metrics tại /metrics

## 🔒 Security

### Development Setup
- Authentication disabled cho local development
- SSL/TLS disabled
- All ports exposed to localhost

### Production Checklist
- [ ] Enable authentication cho all services
- [ ] Configure SSL/TLS certificates
- [ ] Restrict network access
- [ ] Use secrets management
- [ ] Enable audit logging
- [ ] Setup backup strategies

## 💾 Backup & Recovery

### Manual Backup

```bash
# PostgreSQL backup
docker exec postgres-ai pg_dump -U postgres ai_assistant_main > backup.sql

# Redis backup
docker exec redis-ai redis-cli BGSAVE

# Weaviate backup
curl -X POST http://localhost:8080/v1/backups/filesystem -H "Content-Type: application/json" -d '{"id": "backup-001"}'
```

### Restore

```bash
# PostgreSQL restore
docker exec -i postgres-ai psql -U postgres ai_assistant_main < backup.sql

# Redis restore
# Copy dump.rdb to data/redis/ and restart

# Weaviate restore
curl -X POST http://localhost:8080/v1/backups/filesystem/backup-001/restore
```

## 🛠️ Development Tools

### PgAdmin (http://localhost:5050)
- Email: admin@ai-assistant.com
- Password: Xem trong .env
- Server: postgres-ai:5432

### Redis Commander (http://localhost:8081)
- URL: http://localhost:8081
- Username/Password: Xem trong .env

## 🐛 Troubleshooting

### Common Issues

**PostgreSQL không start:**
```bash
# Check logs
docker-compose logs postgresql

# Verify volume permissions
ls -la data/postgresql/

# Reset data (CAUTION: Data loss)
docker-compose down -v
rm -rf data/postgresql/*
docker-compose up -d
```

**Redis connection issues:**
```bash
# Check Redis config
docker exec redis-ai redis-cli CONFIG GET "*"

# Test connection
docker exec redis-ai redis-cli ping
```

**Weaviate không response:**
```bash
# Check Weaviate status
curl http://localhost:8080/v1/meta

# View logs
docker-compose logs weaviate

# Verify OpenAI API key
echo $OPENAI_API_KEY
```

### Performance Issues

**PostgreSQL slow queries:**
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check locks
SELECT * FROM pg_locks WHERE NOT granted;
```

**Redis memory issues:**
```bash
# Check memory usage
docker exec redis-ai redis-cli INFO memory

# View slow operations
docker exec redis-ai redis-cli SLOWLOG GET 10
```

## 📚 Resources

- [PostgreSQL Documentation](https://postgresql.org/docs/)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [Redis Documentation](https://redis.io/documentation)
- [Weaviate Documentation](https://weaviate.io/developers/weaviate)
- [Docker Compose Reference](https://docs.docker.com/compose/)

## 🆘 Support

Nếu gặp vấn đề:
1. Check logs: `docker-compose logs [service-name]`
2. Verify configuration: `docker-compose config`
3. Check service status: `docker-compose ps`
4. Review .env file settings
5. Consult troubleshooting section above

---

**Created**: 2024-12-25  
**Version**: 1.0  
**Maintainer**: AI Assistant Platform Team 