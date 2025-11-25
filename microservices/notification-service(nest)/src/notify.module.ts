// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module, Global } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MongoModule } from './infrastructure/mongo/mongo.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RabbitModule } from './infrastructure/rabbit/rabbit.module';
import { DebugController } from './presentation/controllers/debug.controller';
import { RedisDebugController } from './presentation/controllers/redis-debug.controller';
import { ScheduleStore } from './infrastructure/redis/schedule.store';
import { RedisService } from './infrastructure/redis/redis.service';
import { SchedulePolicyService } from './domain/services/schedule-policy.service';
import { ScheduleSyncUseCase } from './application/use-cases/schedule-sync.usecase';
import { ScheduleController } from './presentation/controllers/schedule.controller';
import { IdempotencyStore } from './infrastructure/redis/idempotency.store';
import { NotifierGateway } from './infrastructure/notifier/notifier.gateway';
import { DispatchDueUseCase } from './application/use-cases/dispatch-due.usecase';
import { DispatchWorker } from './infrastructure/workers/dispatch.worker';

@Global()
@Module({
  imports: [ConfigModule, MongoModule, RedisModule, RabbitModule],
  controllers: [DebugController, RedisDebugController, ScheduleController],
  providers: [
    RedisService,
    ScheduleStore,
    SchedulePolicyService,
    ScheduleSyncUseCase,
    IdempotencyStore,
    NotifierGateway,
    DispatchDueUseCase,
    DispatchWorker,
  ],
  exports: [ScheduleStore],
})
export class AppModule {}
