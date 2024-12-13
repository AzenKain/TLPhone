import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserDetailEntity, UserEntity } from 'src/types/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';
import { ReviewEntity } from '../types/review';
import { CartModule } from '../cart/cart.module';
import {
  ImageDetailEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductVariantEntity,
  TagsEntity,
} from '../types/product';
import { CartEntity, CartItemEntity } from '../types/cart';


@Module({
  imports: [TypeOrmModule.forFeature([
    UserEntity,
    UserDetailEntity,
    ReviewEntity,
    CartEntity,
    CartItemEntity,
    ProductEntity,
    ProductDetailEntity,
    ImageDetailEntity,
    TagsEntity,
    ProductVariantEntity
  ]),
    HttpModule,
    CartModule
  ],
  providers: [UserService, UserResolver,],
  controllers: [UserController]
})
export class UserModule {}
