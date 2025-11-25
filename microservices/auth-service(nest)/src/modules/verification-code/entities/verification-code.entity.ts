import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('verification_codes')
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.verification_codes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 10 })
  code: string;

  @Column({
    type: 'enum',
    enum: ['email_verification', 'password_reset'],
  })
  type: 'email_verification' | 'password_reset';

  @Column({ type: 'datetime' })
  expires_at: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
