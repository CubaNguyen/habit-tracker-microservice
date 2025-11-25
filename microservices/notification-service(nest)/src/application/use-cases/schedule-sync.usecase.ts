import { Injectable, Inject } from '@nestjs/common';
import { NOTIFICATION_REPO } from '../../domain/repositories/notification.repository';
import { ScheduleStore } from '../../infrastructure/redis/schedule.store';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { SchedulePolicyService } from '../../domain/services/schedule-policy.service';
import type { NotificationRepository } from '../../domain/repositories/notification.repository'; // ✅ Dòng này

@Injectable()
export class ScheduleSyncUseCase {
  constructor(
    @Inject(NOTIFICATION_REPO)
    private readonly repo: NotificationRepository,
    private readonly redis: RedisService,
    private readonly scheduleStore: ScheduleStore,
    private readonly policy: SchedulePolicyService,
  ) {}

  /**
   * horizonDays: khoảng thời gian tính trước (vd: 10 ngày)
   */
  async execute(horizonDays = 10): Promise<void> {
    const notifications = await this.repo.findAllActive();
    const redisClient = this.redis.getClient();

    console.log(`🔄 Found ${notifications.length} notifications`);

    for (const n of notifications) {
      console.log(`→ processing notification ${n._id}`);

      if (n.notifyDatetime) {
        console.log(`   one-time notify at ${n.notifyDatetime}`);
        const timestamp = new Date(n.notifyDatetime).getTime();
        await this.scheduleStore.enqueueSlots([
          {
            notificationId: n._id,
            slotKey: this.policy.makeSlotKey(timestamp),
            payload: { message: n.message, type: n.type, habitId: n.habitId },
            timestamp,
          },
        ]);
        continue;
      }

      if (n.repeatRuleId && n.notifyTime && n.timezone) {
        const ruleKey = `notify:rule:${n.repeatRuleId}`;
        const rule = await redisClient.hgetall(ruleKey);
        console.log(`   fetched rule from redis:`, rule);

        if (!rule || !rule.repeatType) {
          console.log(`   ⚠️ rule empty, skipping`);
          continue;
        }

        const slots = this.policy.expandSlots(
          rule,
          n.notifyTime,
          n.timezone,
          horizonDays,
        );
        console.log(`   generated ${slots.length} slots`);

        const jobs = slots.map((date) => ({
          notificationId: n._id,
          slotKey: this.policy.makeSlotKey(date.getTime()),
          payload: { message: n.message, type: n.type, habitId: n.habitId },
          timestamp: date.getTime(),
        }));

        await this.scheduleStore.enqueueSlots(jobs);
      }
    }

    console.log('✅ schedule sync completed');
  }
}
