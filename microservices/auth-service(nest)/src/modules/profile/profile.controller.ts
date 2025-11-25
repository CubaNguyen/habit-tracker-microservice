import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Public } from 'src/decorator/customize';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Public()
  @Get('/timezones')
  findAll() {
    return this.profileService.getAllTimezones();
  }

  @Get(':id')
  async getProfile(@Param('id') userId: number) {
    const profile = await this.profileService.getProfileByUserId(userId);

    return profile;
  }
  @Public()
  @Get('internal/:id')
  async getProfileInternal(@Param('id') userId: number) {
    const profile = await this.profileService.getProfileByUserId(userId);

    return profile;
  }

  @Put()
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const user_id = req.user.id; // lấy từ JWT payload
    return this.profileService.updateOrCreate(user_id, updateProfileDto);
  }
}
