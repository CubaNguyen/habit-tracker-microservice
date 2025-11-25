import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { AppConfigService } from '../../config/config.service';
import { ConfigModule } from 'src/config/config.module';
import { ScheduleStore } from './schedule.store';

@Module({
  imports: [ConfigModule],
  providers: [RedisService, AppConfigService, ScheduleStore],
  exports: [RedisService, ScheduleStore],
})
export class RedisModule {}
