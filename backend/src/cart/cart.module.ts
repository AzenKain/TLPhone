import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { CartEntity, CartItemEntity } from '../types/cart';
import { ProductEntity, ProductVariantEntity } from '../types/product';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemEntity, ProductEntity, ProductVariantEntity]),
  ],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule {}
