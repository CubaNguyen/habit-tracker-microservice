import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { AppConfigService } from '../../config/config.service';
import { HabitRuleConsumer } from './events.consumer';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RabbitService, AppConfigService, HabitRuleConsumer],
  exports: [RabbitService],
})
export class RabbitModule {}
