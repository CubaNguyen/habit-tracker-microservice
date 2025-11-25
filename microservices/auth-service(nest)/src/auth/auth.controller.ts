import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from 'src/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyEmailDto } from 'src/modules/verification-code/dto/VerifyEmailDto';
import { ResetPasswordDto } from './dto/ResetPasswordDto ';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @Public()
  async login(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('signup')
  @Public()
  async signUp(@Body() dto: CreateAuthDto) {
    // Implement your sign-up logic here
    return this.authService.signUp(dto);
  }
  @Get('users/:id')
  @Public()
  async getUserById(@Param('id') id: number) {
    return this.authService.getUserById(id); // 👈 gọi qua service
  }

  @Post('verify-email')
  @Public()
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.user_id, dto.code);
  }
  @Post('resend-verification')
  @Public()
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.code, dto.password);
  }
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }
  @Public()
  @Post('refresh-token')
  async refreshToken(@Body('refresh_token') refresh_token: string) {
    return this.authService.refreshToken(refresh_token);
  }
}
