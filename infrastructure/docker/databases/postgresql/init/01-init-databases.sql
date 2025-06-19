-- AI Assistant Platform - Database Initialization Script
-- This script runs after database creation to set up initial structure

-- =============================================================================
-- MAIN DATABASE: ai_assistant_main
-- =============================================================================
\c ai_assistant_main;

-- Create schemas for different services
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS conversations;
CREATE SCHEMA IF NOT EXISTS knowledge;
CREATE SCHEMA IF NOT EXISTS integrations;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path to include all schemas
ALTER DATABASE ai_assistant_main SET search_path TO users,conversations,knowledge,integrations,analytics,public;

-- Create comment on database
COMMENT ON DATABASE ai_assistant_main IS 'Main database for AI Assistant Platform containing all business data';

-- =============================================================================
-- AUDIT DATABASE: ai_assistant_audit
-- =============================================================================
\c ai_assistant_audit;

-- Create audit schema
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS compliance;

-- Set search path
ALTER DATABASE ai_assistant_audit SET search_path TO audit,security,compliance,public;

-- Create comment on database
COMMENT ON DATABASE ai_assistant_audit IS 'Audit database for tracking all system activities and security events';

-- =============================================================================
-- CACHE DATABASE: ai_assistant_cache
-- =============================================================================
\c ai_assistant_cache;

-- Create cache schemas
CREATE SCHEMA IF NOT EXISTS cache;
CREATE SCHEMA IF NOT EXISTS sessions;
CREATE SCHEMA IF NOT EXISTS temp;

-- Set search path
ALTER DATABASE ai_assistant_cache SET search_path TO cache,sessions,temp,public;

-- Create comment on database
COMMENT ON DATABASE ai_assistant_cache IS 'Cache database for temporary data and session management';

-- =============================================================================
-- RETURN TO MAIN DATABASE
-- =============================================================================
\c ai_assistant_main;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully';
    RAISE NOTICE 'Created databases: ai_assistant_main, ai_assistant_audit, ai_assistant_cache';
    RAISE NOTICE 'AI Assistant Platform is ready for schema setup';
END $$; 