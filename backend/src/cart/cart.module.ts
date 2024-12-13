import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { CartEntity, CartItemEntity } from '../types/cart';
import {
  ImageDetailEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductVariantEntity,
  TagsEntity,
} from '../types/product';
import { CartResolver } from './cart.resolver';
import { OrderStatusHistoryEntity } from '../types/order';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      ProductEntity,
      ProductDetailEntity,
      ImageDetailEntity,
      TagsEntity,
      ProductVariantEntity,

    ]),
  ],
  providers: [CartService, CartResolver],
  exports: [CartService]
})
export class CartModule {}
