import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly RETRY_INTERVAL = 2000; // ms
  private readonly MAX_RETRIES = 10;

  constructor(private readonly config: AppConfigService) {}

  async onModuleInit() {
    await this.connectWithRetry();
  }

  /** 🔁 Tự động retry nếu chưa kết nối RabbitMQ */
  private async connectWithRetry() {
    let attempts = 0;

    while (attempts < this.MAX_RETRIES) {
      try {
        this.connection = await amqp.connect(this.config.rabbitUrl);
        this.channel = await this.connection.createChannel();
        console.log('✅ [RabbitService] Connected to RabbitMQ');
        return;
      } catch (err) {
        attempts++;
        console.warn(
          `⚠️ [RabbitService] Failed to connect to RabbitMQ (attempt ${attempts}/${this.MAX_RETRIES}): ${err.message}`,
        );
        await new Promise((r) => setTimeout(r, this.RETRY_INTERVAL));
      }
    }

    throw new Error(
      '❌ [RabbitService] Could not connect to RabbitMQ after max retries',
    );
  }

  /** ✅ Trả về channel khi đã sẵn sàng */
  async getChannel(): Promise<amqp.Channel> {
    if (this.channel) return this.channel;

    // chờ trong trường hợp consumer gọi trước khi channel sẵn sàng
    console.log('⏳ Waiting for RabbitMQ channel to initialize...');
    let retries = 5;
    while (!this.channel && retries > 0) {
      await new Promise((res) => setTimeout(res, 1000));
      retries--;
    }

    if (!this.channel) {
      throw new Error('❌ RabbitMQ channel not ready');
    }

    return this.channel;
  }

  async onModuleDestroy() {
    console.log('🧹 [RabbitService] Closing RabbitMQ connection...');
    await this.channel?.close();
    await this.connection?.close();
  }
}
