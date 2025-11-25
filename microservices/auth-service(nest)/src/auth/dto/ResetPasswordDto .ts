import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @Length(8, 8)
  code: string;

  @MinLength(6, { message: 'Password phải ít nhất 6 ký tự' })
  password: string;
}
