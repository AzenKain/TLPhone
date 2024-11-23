import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Relation, OneToOne,
} from 'typeorm';
import { ProductEntity, ProductVariantEntity } from '../product';


@Entity({ name: 'CartItem' })
export class CartItemEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  quantity: number;

  @ManyToOne(() => CartEntity, (it) => it.cartProducts)
  @JoinColumn({ name: 'cartId' })
  cart: Relation<CartEntity>;

  @ManyToOne(() => ProductEntity, (product) => product.orderProducts)
  @JoinColumn({ name: 'productId' })
  product: Relation<ProductEntity>;

  @ManyToOne(() => ProductVariantEntity, (it) => it.cartItem)
  @JoinColumn()
  productVariant: Relation<ProductVariantEntity>;
}

@Entity({ name: 'Cart' })
export class CartEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToMany(() => CartItemEntity, (it) => it.cart)
  cartProducts: Relation<CartItemEntity[]>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}