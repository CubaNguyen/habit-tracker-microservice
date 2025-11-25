import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '../../config/config.service';
import {
  NotificationSchema,
  NotificationDoc,
} from './schemas/notification.schema';

import { NOTIFICATION_REPO } from '../../domain/repositories/notification.repository';
import { NotificationRepositoryImpl } from './notification.repository.impl';
import { ConfigModule } from '../../config/config.module';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        // uri: config.mongoUri,
        const uri = config.mongoUri;
        console.log(`🧩 Connecting to MongoDB via Compass at: ${uri}`);
        return { uri };
      },
    }),
    MongooseModule.forFeature([
      { name: NotificationDoc.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
    AppConfigService,
    { provide: NOTIFICATION_REPO, useClass: NotificationRepositoryImpl },
  ],
  exports: [AppConfigService, MongooseModule, NOTIFICATION_REPO],
})
export class MongoModule {}
