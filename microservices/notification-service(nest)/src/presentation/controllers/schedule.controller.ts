import { Controller, Post, Query } from '@nestjs/common';
import { ScheduleSyncUseCase } from '../../application/use-cases/schedule-sync.usecase';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleSyncUseCase: ScheduleSyncUseCase) {}

  @Post('sync')
  async sync(@Query('days') days?: string) {
    const horizon = Number(days) || 10;
    await this.scheduleSyncUseCase.execute(horizon);
    return { success: true, message: `Synced ${horizon} days ahead.` };
  }
}
