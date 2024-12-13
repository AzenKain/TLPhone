import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/types/user';
import {
  CustomerInfoEntity,
  DeliveryInfoEntity,
  OrderEntity,
  OrderProductEntity,
  OrderStatusHistoryEntity, PaymentInfoEntity,
} from 'src/types/order';
import {
  ImageDetailEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductVariantEntity,
  TagsEntity,
} from 'src/types/product';
import { HttpModule } from '@nestjs/axios';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrderEntity,
      DeliveryInfoEntity,
      CustomerInfoEntity,
      OrderProductEntity,
      PaymentInfoEntity,
      OrderStatusHistoryEntity,
      ProductEntity,
      ProductDetailEntity,
      ImageDetailEntity,
      TagsEntity,
      ProductVariantEntity,
    ]),
    HttpModule, CartModule
  ],
  providers: [OrderService, OrderResolver,],
  exports: [OrderService],
  controllers: [OrderController]
})
export class OrderModule { }
