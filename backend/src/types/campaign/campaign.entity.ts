import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable
} from 'typeorm';
import { ProductEntity } from '../product';

@Entity({ name: 'Campaign' })
export class CampaignEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  discountPercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  maxDiscountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minDiscountAmount: number;

  @Column({ type: 'boolean', default: false })
  hasBanner: boolean;

  @Column({ nullable: true })
  bannerUrl?: string;

  @ManyToMany(() => ProductEntity, (product) => product.campaigns)
  @JoinTable()
  products: ProductEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
