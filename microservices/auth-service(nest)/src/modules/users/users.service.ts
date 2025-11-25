import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils/bcrypt.util';
import { verify } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    // Hash password
    const hashedPassword = await hashPassword(dto.password);

    const newUser = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
    });

    return this.userRepo.save(newUser);
  }
  async signUpService(email: string, password: string) {
    const newUser = await this.userRepo.create({
      email,
      password,
    });
    return this.userRepo.save(newUser);
  }

  async verifyEmailUser(id: number) {
    return this.userRepo.update({ id: id }, { is_email_verified: true });
  }

  async updateProfileCompletion(userId: number, profile_complete: boolean) {
    await this.userRepo.update(
      { id: userId },
      { profile_complete: profile_complete },
    );
    return await this.userRepo.findOne({ where: { id: userId } });
  }
}
