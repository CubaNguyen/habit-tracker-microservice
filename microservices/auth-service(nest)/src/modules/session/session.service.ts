import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  // 🔹 Tạo session mới khi login
  async createSession(user: User, refreshToken: string, expiresAt: Date) {
    const session = this.sessionRepo.create({
      user,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });
    return this.sessionRepo.save(session);
  }

  // 🔹 Tìm session theo refresh_token
  async findByToken(refreshToken: string) {
    return this.sessionRepo.findOne({
      where: { refresh_token: refreshToken },
      relations: ['user'],
    });
  }

  // 🔹 Xoá session theo user_id (khi logout all)
  async deleteByUser(userId: number) {
    return this.sessionRepo.delete({ user: { id: userId } as any });
  }

  // 🔹 Xoá session theo refresh_token (khi logout 1 thiết bị)
  async deleteByToken(refreshToken: string) {
    return this.sessionRepo.delete({ refresh_token: refreshToken });
  }

  // 🔹 Dọn session hết hạn (tùy chọn chạy cron)
  async clearExpiredSessions() {
    const now = new Date();
    return this.sessionRepo
      .createQueryBuilder()
      .delete()
      .from(Session)
      .where('expires_at < :now', { now })
      .execute();
  }
}
