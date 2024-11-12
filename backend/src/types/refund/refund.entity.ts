import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user';
import { OrderProductEntity } from '../order';
import { ProductEntity } from '../product';

@Entity({ name: 'Refund' })
export class RefundEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  reason: string;

  @Column({ type: 'boolean' })
  isDisplay: boolean;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>;

  @ManyToOne(() => OrderProductEntity, (orderProduct) => orderProduct.refunds)
  @JoinColumn({ name: 'order_product_id' })
  orderProduct: Relation<OrderProductEntity>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

