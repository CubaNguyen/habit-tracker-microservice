import { Injectable, OnModuleInit } from '@nestjs/common';
import { DispatchDueUseCase } from '../../application/use-cases/dispatch-due.usecase';

@Injectable()
export class DispatchWorker implements OnModuleInit {
  constructor(private readonly dispatch: DispatchDueUseCase) {}

  async onModuleInit() {
    console.log('🕒 DispatchWorker started (check every 10s)');
    setInterval(async () => {
      try {
        await this.dispatch.execute(50);
      } catch (err) {
        console.error('❌ DispatchWorker error:', err.message);
      }
    }, 10_000); // 10 giây
  }
}
