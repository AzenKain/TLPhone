import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity, ProductVariantEntity } from '../types/product';
import { Repository } from 'typeorm';
import { UserEntity } from '../types/user';
import { CartEntity, CartItemEntity } from '../types/cart';

@Injectable()
export class CartService {
  constructor(
    private config: ConfigService,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity) private cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductVariantEntity) private productVariantRepository: Repository<ProductVariantEntity>,
  ) { }

  private CheckRoleUser(user: UserEntity) {
    if (!user.role.includes("ADMIN") && !user.role.includes("STAFF")) {
      throw new ForbiddenException('The user does not have permission');
    }
  }

  async CreateCart() {
    const newCart = this.cartRepository.create({
    cartProducts: []
    });
    return await this.cartRepository.save(newCart);
  }
}
