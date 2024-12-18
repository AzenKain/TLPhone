import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Otp' })
export class OtpEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'boolean' })
  isDisplay: boolean;

  @Column()
  email: string;

  @Column()
  otpCode: string;

  @Column()
  type: string;

  @Column({ type: 'boolean' })
  value: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
