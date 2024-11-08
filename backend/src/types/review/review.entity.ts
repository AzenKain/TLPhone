import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user';
import { ProductEntity } from '../product';


@Entity({ name: 'Review' })
export class ReviewEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  content: string;

  @Column({ type: 'int', default: 1 })
  star: number;

  @Column({ type: 'boolean' })
  isDisplay: boolean;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>;

  @ManyToOne(() => ProductEntity, (product) => product.reviews)
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductEntity>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
