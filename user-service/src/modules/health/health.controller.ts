import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Get overall health status' })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
  })
  @ApiResponse({
    status: 503,
    description: 'Health check failed',
  })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  @Get('database')
  @HealthCheck()
  @ApiOperation({ summary: 'Get database health status' })
  @ApiResponse({
    status: 200,
    description: 'Database health check successful',
  })
  @ApiResponse({
    status: 503,
    description: 'Database health check failed',
  })
  checkDatabase() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('memory')
  @HealthCheck()
  @ApiOperation({ summary: 'Get memory health status' })
  @ApiResponse({
    status: 200,
    description: 'Memory health check successful',
  })
  @ApiResponse({
    status: 503,
    description: 'Memory health check failed',
  })
  checkMemory() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }

  @Get('storage')
  @HealthCheck()
  @ApiOperation({ summary: 'Get storage health status' })
  @ApiResponse({
    status: 200,
    description: 'Storage health check successful',
  })
  @ApiResponse({
    status: 503,
    description: 'Storage health check failed',
  })
  checkStorage() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }
} 