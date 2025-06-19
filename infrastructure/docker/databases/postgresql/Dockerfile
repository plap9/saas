# AI Assistant Platform - Custom PostgreSQL with pgvector
FROM postgres:15-alpine

# Install dependencies cho pgvector và other extensions
RUN apk add --no-cache \
    build-base \
    clang15 \
    llvm15-dev \
    git \
    postgresql-dev \
    && rm -rf /var/cache/apk/*

# Install pgvector extension
RUN git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git /tmp/pgvector \
    && cd /tmp/pgvector \
    && make \
    && make install \
    && rm -rf /tmp/pgvector

# Install additional useful extensions
RUN apk add --no-cache postgresql-contrib

# Create necessary directories
RUN mkdir -p /var/lib/postgresql/data \
    && mkdir -p /docker-entrypoint-initdb.d \
    && mkdir -p /etc/postgresql

# Copy custom PostgreSQL configuration
COPY config/postgresql.conf /etc/postgresql/postgresql.conf

# Set proper ownership và permissions
RUN chown -R postgres:postgres /var/lib/postgresql \
    && chown -R postgres:postgres /etc/postgresql \
    && chmod 755 /var/lib/postgresql \
    && chmod 644 /etc/postgresql/postgresql.conf

# Copy initialization scripts
COPY init/*.sql /docker-entrypoint-initdb.d/

# Create custom script để support multiple databases
COPY init/create-multiple-postgresql-databases.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/create-multiple-postgresql-databases.sh

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD pg_isready -U postgres -d ai_assistant_main || exit 1

# Use postgres user
USER postgres

# Default command
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"] 