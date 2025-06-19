-- AI Assistant Platform - PostgreSQL Extensions Setup
-- This script creates all necessary extensions for AI features

-- =============================================================================
-- MAIN DATABASE EXTENSIONS: ai_assistant_main
-- =============================================================================
\c ai_assistant_main;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "vector" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "btree_gin" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "btree_gist" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "unaccent" SCHEMA public;

-- Log extensions created
DO $$
BEGIN
    RAISE NOTICE 'Main database extensions created:';
    RAISE NOTICE '- uuid-ossp: UUID generation functions';
    RAISE NOTICE '- vector: Vector similarity search for AI embeddings';
    RAISE NOTICE '- pg_stat_statements: Query performance monitoring';
    RAISE NOTICE '- pgcrypto: Cryptographic functions';
    RAISE NOTICE '- btree_gin: Optimized indexing for arrays and JSONB';
    RAISE NOTICE '- btree_gist: Additional indexing methods';
    RAISE NOTICE '- pg_trgm: Text similarity and fuzzy matching';
    RAISE NOTICE '- unaccent: Remove accents for better text search';
END $$;

-- =============================================================================
-- AUDIT DATABASE EXTENSIONS: ai_assistant_audit
-- =============================================================================
\c ai_assistant_audit;

-- Enable necessary extensions for audit
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "btree_gin" SCHEMA public;

-- Log audit extensions
DO $$
BEGIN
    RAISE NOTICE 'Audit database extensions created:';
    RAISE NOTICE '- uuid-ossp: UUID generation for audit records';
    RAISE NOTICE '- pgcrypto: Cryptographic functions for secure audit logs';
    RAISE NOTICE '- pg_stat_statements: Performance monitoring';
    RAISE NOTICE '- btree_gin: Optimized indexing for audit queries';
END $$;

-- =============================================================================
-- CACHE DATABASE EXTENSIONS: ai_assistant_cache
-- =============================================================================
\c ai_assistant_cache;

-- Enable necessary extensions for cache
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "btree_gin" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" SCHEMA public;

-- Log cache extensions
DO $$
BEGIN
    RAISE NOTICE 'Cache database extensions created:';
    RAISE NOTICE '- uuid-ossp: UUID generation for cache keys';
    RAISE NOTICE '- btree_gin: Optimized indexing for cache queries';
    RAISE NOTICE '- pg_stat_statements: Performance monitoring';
END $$;

-- =============================================================================
-- RETURN TO MAIN DATABASE & VERIFY EXTENSIONS
-- =============================================================================
\c ai_assistant_main;

-- Verify vector extension is working
DO $$
BEGIN
    -- Test vector extension
    PERFORM vector '[1,2,3]'::vector;
    RAISE NOTICE 'Vector extension verified - AI embeddings ready';
    
    -- Test UUID generation
    PERFORM uuid_generate_v4();
    RAISE NOTICE 'UUID extension verified - unique ID generation ready';
    
    -- Test trigram extension  
    PERFORM similarity('hello', 'helo');
    RAISE NOTICE 'Trigram extension verified - text similarity search ready';
    
    RAISE NOTICE 'All extensions verified successfully';
    RAISE NOTICE 'Database ready for AI Assistant Platform';
END $$; 