import { Controller, Post, Get, Body } from '@nestjs/common';
import { ScheduleStore } from '../../infrastructure/redis/schedule.store';

@Controller('redis-debug')
export class RedisDebugController {
  constructor(private readonly schedule: ScheduleStore) {}

  @Post('enqueue')
  async enqueue(@Body() body: any) {
    const now = Date.now();
    const jobs = [
      {
        notificationId: body.notificationId || 'abc123',
        slotKey: '20251007-2000',
        payload: body.payload || { msg: 'Test Redis scheduler' },
        timestamp: now + 5000, // sau 5 giây
      },
    ];
    await this.schedule.enqueueSlots(jobs);
    return { message: 'Job added to Redis', jobs };
  }

  @Get('pop')
  async pop(): Promise<any> {
    const jobs = await this.schedule.popDue();
    return { jobs };
  }
}
