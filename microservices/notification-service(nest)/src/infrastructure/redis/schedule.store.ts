// src/infrastructure/redis/schedule.store.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

interface ScheduleJob {
  notificationId: string;
  slotKey: string; // dạng YYYYMMDD-HHmm (vd: "20251007-0800")
  payload: any;
  timestamp: number; // epoch time ms (dùng để sắp theo thứ tự)
}

@Injectable()
export class ScheduleStore {
  private readonly zsetKey = 'notify:schedule:zset';

  constructor(private readonly redisService: RedisService) {}

  private get client() {
    return this.redisService.getClient();
  }

  /**
   * enqueueSlots
   * thêm nhiều slot vào ZSET + lưu payload
   */
  async enqueueSlots(jobs: ScheduleJob[]): Promise<void> {
    if (!jobs || jobs.length === 0) return;

    const pipeline = this.client.multi();
    for (const job of jobs) {
      const payloadKey = `notify:payload:${job.notificationId}:${job.slotKey}`;
      for (const [field, value] of Object.entries(job.payload)) {
        pipeline.hset(payloadKey, field, String(value));
      }
      pipeline.zadd(this.zsetKey, job.timestamp, payloadKey);
      pipeline.expire(payloadKey, 14 * 24 * 3600); // TTL 14 ngày
    }
    await pipeline.exec();
  }

  /**
   * popDue
   * lấy các job đến hạn <= now
   */
  async popDue(maxBatch = 100): Promise<ScheduleJob[]> {
    const now = Date.now();
    const payloadKeys: string[] = await this.client.zrangebyscore(
      this.zsetKey,
      0,
      now,
      'LIMIT',
      0,
      maxBatch,
    );

    if (payloadKeys.length === 0) return [];

    // xóa khỏi ZSET
    await this.client.zrem(this.zsetKey, ...payloadKeys);

    // đọc payloads
    const pipeline = this.client.multi();
    payloadKeys.forEach((key) => pipeline.hgetall(key));
    const results = await pipeline.exec();

    if (!results) {
      return [];
    }

    return payloadKeys.map((key, i) => {
      const [_, data] = results[i];
      const parts = key.split(':'); // notify:payload:<id>:<slotKey>
      const notificationId = parts[2];
      const slotKey = parts[3];
      return {
        notificationId,
        slotKey,
        payload: data,
        timestamp: now,
      };
    });
  }

  /**
   * clearAll
   * dọn toàn bộ ZSET (chỉ dùng khi test)
   */
  async clearAll(): Promise<void> {
    await this.client.del(this.zsetKey);
  }
}
