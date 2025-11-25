import { Type } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsNumber()
  @Type(() => Number)
  user_id: number;

  @IsString()
  @Length(8, 8)
  code: string;
}
