import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: NestConfigService) {}

  get mongoUri() {
    return this.config.get<string>('MONGO_URI');
  }

  get redisUrl() {
    return this.config.get<string>('REDIS_URL');
  }

  get rabbitUrl() {
    return this.config.get<string>('RABBIT_URL');
  }

  get defaultTimezone() {
    return this.config.get<string>('DEFAULT_TIMEZONE', 'Asia/Ho_Chi_Minh');
  }

  get scheduleHorizonDays() {
    return Number(this.config.get<number>('SCHEDULE_HORIZON_DAYS', 10));
  }
}
