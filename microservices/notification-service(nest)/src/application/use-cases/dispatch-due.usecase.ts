import { Injectable } from '@nestjs/common';
import { ScheduleStore } from '../../infrastructure/redis/schedule.store';
import { IdempotencyStore } from '../../infrastructure/redis/idempotency.store';
import { NotifierGateway } from '../../infrastructure/notifier/notifier.gateway';

@Injectable()
export class DispatchDueUseCase {
  constructor(
    private readonly schedule: ScheduleStore,
    private readonly idem: IdempotencyStore,
    private readonly notifier: NotifierGateway,
  ) {}

  async execute(batchSize = 50) {
    const jobs = await this.schedule.popDue(batchSize);
    if (jobs.length === 0) return;

    for (const job of jobs) {
      const key = `notify:sent:${job.notificationId}:${job.slotKey}`;
      const first = await this.idem.tryMark(key, 24 * 3600); // tránh gửi trùng trong 1 ngày
      if (!first) continue;

      await this.notifier.send(job.payload);
    }
  }
}
