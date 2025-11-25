import { Injectable } from '@nestjs/common';

@Injectable()
export class NotifierGateway {
  async send(payload: any) {
    console.log(
      `📨 [NOTIFY] (${payload.type}) ${payload.message} (habit=${payload.habitId})`,
    );
    // sau này có thể thay console.log bằng gửi WebSocket / Email / FCM push
  }
}
