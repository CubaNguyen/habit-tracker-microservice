import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly config: AppConfigService) {}

  onModuleInit() {
    this.client = new Redis(this.config.redisUrl || 'redis://localhost:6379');
    this.client.on('connect', () => console.log('✅ Redis connected'));
  }

  getClient() {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
