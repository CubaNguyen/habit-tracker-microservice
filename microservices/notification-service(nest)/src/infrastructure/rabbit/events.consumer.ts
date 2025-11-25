import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HabitRuleConsumer implements OnModuleInit {
  private readonly exchange = 'habit.events';
  private readonly queue = 'notify.habit.rules';
  private readonly routingKeys = [
    'habit.rule.created',
    'habit.rule.updated',
    'habit.rule.deleted',
  ];

  constructor(
    private readonly rabbit: RabbitService,
    private readonly redis: RedisService,
  ) {}

  async onModuleInit() {
    const ch = await this.rabbit.getChannel(); // ⬅️ await vì getChannel là async

    await ch.assertExchange(this.exchange, 'topic', { durable: true });
    await ch.assertQueue(this.queue, { durable: true });

    for (const key of this.routingKeys) {
      await ch.bindQueue(this.queue, this.exchange, key);
    }

    await ch.consume(this.queue, async (msg) => {
      if (!msg) return;

      const routingKey = msg.fields.routingKey;
      const payload = JSON.parse(msg.content.toString());
      console.log(`📩 [RabbitMQ] Received ${routingKey}`, payload);

      try {
        await this.handleRuleEvent(routingKey, payload);
        ch.ack(msg);
      } catch (err) {
        console.error('❌ RabbitMQ consumer error:', err);
        ch.nack(msg, false, false);
      }
    });

    console.log(`✅ RabbitMQ consumer bound to exchange "${this.exchange}"`);
  }

  private async handleRuleEvent(routingKey: string, payload: any) {
    const key = `notify:rule:${payload.repeatRuleId}`;

    switch (routingKey) {
      case 'habit.rule.created':
      case 'habit.rule.updated':
        await this.redis.getClient().hmset(key, {
          habitId: payload.habitId,
          repeatType: payload.repeatType,
          repeatValue: JSON.stringify(payload.repeatValue),
          startDate: payload.startDate || '',
          endDate: payload.endDate || '',
          timezone: payload.timezone || 'Asia/Ho_Chi_Minh',
        });
        // TTL 14 ngày
        await this.redis.getClient().expire(key, 14 * 24 * 3600);
        console.log(`🔁 Cached repeat rule: ${key}`);
        break;

      case 'habit.rule.deleted':
        await this.redis.getClient().del(key);
        console.log(`🗑️ Deleted rule cache: ${key}`);
        break;

      default:
        console.log('⚠️ Unknown routing key:', routingKey);
    }
  }
}
