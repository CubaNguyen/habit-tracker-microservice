import { UsersService } from './../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import moment from 'moment-timezone';
import { JwtService } from '@nestjs/jwt';
import { Session } from '../session/entities/session.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Session) private sessionRepository: Repository<Session>, // ❌ lỗi tại đây
  ) {}
  getAllTimezones() {
    return { message: 'Get timezones succes', data: moment.tz.names() };
  }
  async updateOrCreate(userId: number, dto: UpdateProfileDto) {
    try {
      // 🔍 Tìm profile theo user_id
      let profile = await this.profileRepo.findOne({
        where: { user_id: userId },
      });

      // ✅ Nếu chưa có profile → tạo mới
      if (!profile) {
        profile = this.profileRepo.create({ user_id: userId, ...dto });
      } else {
        // ✅ Nếu có → merge thông tin mới
        Object.assign(profile, dto);
      }

      // ✅ Lưu lại profile (TypeORM tự nhận biết insert/update)
      const savedProfile = await this.profileRepo.save(profile);

      // ✅ Kiểm tra hoàn thiện thông tin
      const requiredFields: (keyof typeof savedProfile)[] = [
        'full_name',
        'timezone',
      ];
      const isComplete = requiredFields.every((f) => !!savedProfile[f]);

      // ✅ Cập nhật trạng thái trong bảng users
      const updatedUser = await this.usersService.updateProfileCompletion(
        userId,
        isComplete,
      );

      // ✅ Sinh token mới nếu hồ sơ đã hoàn tất
      let newTokens = {};
      if (isComplete) {
        const payload = {
          user_id: userId,
          email: updatedUser?.email,
          is_email_verified: updatedUser?.is_email_verified,
          profile_complete: true,
        };

        try {
          const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
          });
          const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
          });

          await this.sessionRepository.save({
            user_id: userId,
            refresh_token,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });

          newTokens = { access_token, refresh_token };
          console.log('✅ newTokens generated:', newTokens);
        } catch (tokenErr) {
          console.error('❌ Error generating tokens:', tokenErr);
        }
      }

      // ✅ Trả kết quả cuối cùng
      return {
        success: true,
        message: profile.id
          ? 'Profile updated successfully'
          : 'Profile created successfully',
        data: {
          profile: savedProfile,
          tokens: newTokens,
        },
        error: null,
      };
    } catch (err) {
      console.error('❌ updateOrCreate() error:', err);
    }
  }
  async getProfileByUserId(userId: number) {
    let data = await this.profileRepo.findOne({
      where: { user_id: userId },
    });

    return { message: 'Get profile succes', data: data };
  }
}
