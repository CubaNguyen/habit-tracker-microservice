import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_REPO } from '../../domain/repositories/notification.repository';
import { Notification } from '../../domain/entities/notification';
import type { NotificationRepository } from '../../domain/repositories/notification.repository';

@Controller('debug')
export class DebugController {
  constructor(
    @Inject(NOTIFICATION_REPO)
    private readonly repo: NotificationRepository,
  ) {}

  @Post()
  async create(@Body() body: any) {
    const datetime: Date | undefined = body.notifyDatetime
      ? new Date(body.notifyDatetime)
      : undefined;

    const n = new Notification(
      '',
      body.habitId,
      body.type,
      body.message,
      body.timezone || 'Asia/Ho_Chi_Minh',
      datetime,
      body.notifyTime,
      body.repeatRuleId,
      body.active ?? true,
    );
    const saved = await this.repo.create(n);
    return saved;
  }

  @Get()
  async all() {
    return await this.repo.findAllActive();
  }

  @Get(':id')
  async one(@Param('id') id: string) {
    return await this.repo.findById(id);
  }
}
