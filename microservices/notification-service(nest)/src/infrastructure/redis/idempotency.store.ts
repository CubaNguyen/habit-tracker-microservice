import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class IdempotencyStore {
  constructor(private readonly redis: RedisService) {}

  private get client() {
    return this.redis.getClient();
  }

  /**
   * đánh dấu job là đã gửi
   * trả về true nếu đây là lần đầu, false nếu trùng
   */
  async tryMark(key: string, ttlSeconds = 86400): Promise<boolean> {
    // Ép kiểu any để tránh lỗi overload TypeScript
    const result = await (this.client as any).set(
      key,
      '1',
      'NX', // chỉ set nếu chưa tồn tại
      'EX', // thời gian hết hạn (giây)
      ttlSeconds,
    );

    return result === 'OK';
  }
}
