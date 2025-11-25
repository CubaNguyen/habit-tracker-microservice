import { VerificationCodeService } from './../modules/verification-code/verification-code.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Session } from '../modules/session/entities/session.entity';

import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from 'src/utils/bcrypt.util';
import { UsersService } from 'src/modules/users/users.service';
import { generateAlphaNumericCode } from 'src/utils/generateCode.util';
import dayjs from 'dayjs';
import { MailService } from 'src/modules/mailer/mail.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private verificationCodeService: VerificationCodeService,
    private mailService: MailService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async validateUser(email: string, password: string) {
    // check email, password
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) return null;
    const passwordValid = await comparePassword(password, user.password);
    if (!passwordValid) {
      return null;
    }
    // remove password from user object
    const { password: _, ...result } = user;

    return result;
  }

  async signIn(user: any) {
    if (!user.is_email_verified) {
      throw new UnauthorizedException(
        'Email chưa được xác minh. Vui lòng kiểm tra hộp thư.',
      );
    }
    const payload = {
      email: user.email,
      sub: user.id,
      profile_complete: user.profile_complete,
    };
    // 3️⃣ Sinh Access token (ngắn hạn, ví dụ 15 phút)
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    // 4️⃣ Sinh Refresh token (dài hơn, ví dụ 7 ngày)
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.sessionRepository.delete({ user_id: user.id });
    // 5️⃣ Lưu refresh token vào bảng sessions
    await this.sessionRepository.save({
      user_id: user.id,
      refresh_token,
      expires_at: expires_at,
    });
    return {
      message: 'Login successful',
      data: {
        access_token,
        refresh_token,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    };
  }

  async signUp(dto: CreateAuthDto) {
    // 1. Check user đã tồn tại chưa
    const existed = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existed) {
      throw new ConflictException({
        message: 'User already exists',
        code: 'USER_ALREADY_EXISTS',
      });
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(dto.password);

    // 3. Save user to DB
    const user = await this.usersService.signUpService(
      dto.email,
      hashedPassword,
    );
    // 4. Create a email code
    const code = generateAlphaNumericCode();
    const expires = dayjs().add(10, 'minute').toDate(); // hết hạn sau 10 phút
    // expires.setMinutes(expires.getMinutes() + 10);
    const type = 'email_verification';
    await this.verificationCodeService.createCodeMail(
      user.id,
      code,
      type,
      expires,
    );

    await this.mailService.sendMail(user.email, code);
    return {
      message: 'Please check your inbox to verify your email address',
      data: user.id,
    };
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'is_email_verified'],
    });
    console.log('🚀 ~ AuthService ~ getUserById ~ user:', user);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User fetched successfully',
      data: user,
    };
  }
  async verifyEmail(user_id: number, code: string) {
    const type = 'email_verification';
    const record = await this.verificationCodeService.findByUserIdAndCode(
      user_id,
      code,
      type,
    );

    if (!record)
      throw new BadRequestException({
        message: 'Invalid mail code',
        code: 'INVALID_MAIL_CODE',
      });
    if (record.used)
      throw new BadRequestException({
        message: 'Code already used',
        code: 'CODE_ALREADY_USED',
      });
    if (record.expires_at < new Date())
      throw new BadRequestException({
        message: 'Code expired',
        code: 'CODE_EXPIRED',
      });

    //Update user → đánh dấu email đã xác thực
    await this.usersService.verifyEmailUser(user_id);

    // Đánh dấu code đã dùng
    await this.verificationCodeService.isCodeUsed(record.id);

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException({
        message: 'Email không tồn tại trong hệ thống.',
      });

    if (user.is_email_verified)
      throw new BadRequestException({ message: 'Email đã được xác minh.' });

    // 🔹 Xóa hoặc vô hiệu hóa mã cũ (tuỳ bạn)
    await this.verificationCodeService.invalidateOldCodes(
      user.id,
      'email_verification',
    );

    const code = generateAlphaNumericCode();
    const expires = dayjs().add(10, 'minute').toDate(); // hết hạn sau 10 phút
    expires.setMinutes(expires.getMinutes() + 10);
    const type = 'email_verification';
    await this.verificationCodeService.createCodeMail(
      user.id,
      code,
      type,
      expires,
    );

    await this.mailService.sendMail(user.email, code);
    return {
      message: 'Please check your inbox to verify your email address.”',
      data: user.id,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const code = generateAlphaNumericCode();
    const expires = dayjs().add(10, 'minute').toDate(); // hết hạn sau 10 phút
    expires.setMinutes(expires.getMinutes() + 10);
    const type = 'password_reset';
    await this.verificationCodeService.createCodeMail(
      user.id,
      code,
      type,
      expires,
    );

    await this.mailService.sendMailForgetPass(user.email, code);
    return { message: 'Verification code sent to email' };
  }
  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const type = 'password_reset';
    const record = await this.verificationCodeService.findByUserIdAndCode(
      user.id,
      code,
      type,
    );

    if (!record)
      throw new BadRequestException({
        message: 'Invalid mail code',
        code: 'INVALID_MAIL_CODE',
      });
    if (record.used)
      throw new BadRequestException({
        message: 'Code already used',
        code: 'CODE_ALREADY_USED',
      });
    if (record.expires_at < new Date())
      throw new BadRequestException({
        message: 'Code expired',
        code: 'CODE_EXPIRED',
      });

    // Cập nhật mật khẩu
    user.password = await hashPassword(newPassword);
    await this.usersRepository.save(user);

    // Đánh dấu code đã dùng
    await this.verificationCodeService.isCodeUsed(record.id);

    return { message: 'Password reset successful' };
  }

  // auth.service.ts
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Old password is incorrect');

    user.password = await hashPassword(newPassword);
    await this.usersRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async refreshToken(refresh_token: string) {
    try {
      // ✅ 1. Decode refresh token để lấy userId
      const payload = this.jwtService.verify(refresh_token);
      const userId = payload.sub;

      // ✅ 2. Kiểm tra token có tồn tại trong DB không
      const session = await this.sessionRepository.findOne({
        where: { user_id: userId, refresh_token },
      });
      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // ✅ 3. Kiểm tra token còn hạn không
      if (new Date() > session.expires_at) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // ✅ 4. Lấy lại thông tin user mới nhất (để cập nhật profile_complete, email, v.v.)
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');

      const newPayload = {
        sub: user.id,
        email: user.email,
        profile_complete: user.profile_complete,
      };

      // ✅ 5. Sinh access token mới
      const new_access_token = await this.jwtService.signAsync(newPayload, {
        expiresIn: '15m',
      });

      return {
        message: 'Token refreshed successfully',
        data: {
          access_token: new_access_token,
          refresh_token, // giữ nguyên token cũ
        },
      };
    } catch (error) {
      console.error('⚠️ Error refreshing token:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
