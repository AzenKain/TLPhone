import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { UserEntity } from '../types/user';
import {
  CustomerInfoEntity,
  DeliveryInfoEntity,
  OrderEntity,
  OrderProductEntity, OrderStatusHistoryEntity,
  PaymentInfoEntity,
} from '../types/order';
import {
  ImageDetailEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductVariantEntity,
  TagsEntity,
} from '../types/product';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([
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
  ]),],
  
  providers: [PaymentService],
  
  controllers: [PaymentController]
})
export class PaymentModule {}
