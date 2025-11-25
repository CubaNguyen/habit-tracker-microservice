import { Injectable } from '@nestjs/common';
import { VerificationCode } from './entities/verification-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VerificationCodeService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
  ) {}
  async createCodeMail(
    user_id: number,
    code: string,
    type: 'email_verification' | 'password_reset',
    expires_at: Date,
  ) {
    return this.verificationCodeRepository.save({
      user_id,
      code,
      type: type,
      expires_at: expires_at,
    });
  }
  async findByUserIdAndCode(
    user_id: number,
    code: string,
    type: 'email_verification' | 'password_reset',
  ) {
    return this.verificationCodeRepository.findOne({
      where: { user_id: user_id, code, type: type },
    });
  }
  async isCodeUsed(id: number) {
    await this.verificationCodeRepository.update({ id: id }, { used: true });
  }
  async invalidateOldCodes(user_id: number, type: string) {
    await this.verificationCodeRepository.update(
      { user_id: user_id, type: type, used: false } as any,
      { used: true }, // vô hiệu hoá mấy mã cũ chưa dùng
    );
  }

  async create(dto: {
    user_id: number;
    code: string;
    type: string;
    expires_at: Date;
  }) {
    const record = this.verificationCodeRepository.create({
      user_id: dto.user_id,
      code: dto.code,
      type: dto.type,
      expires_at: dto.expires_at,
      used: false,
    } as Partial<VerificationCode>);

    return await this.verificationCodeRepository.save(record);
  }
}
