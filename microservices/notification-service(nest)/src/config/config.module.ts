import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  // ConfigService as NestConfigService,
} from '@nestjs/config';
import { AppConfigService } from './config.service';
import { validateEnv } from './validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: '.env',
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}
