import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ImageDetailEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductVariantEntity,
  TagsEntity,
} from '../types/product';
import { Repository } from 'typeorm';
import { UserEntity } from '../types/user';
import { CartEntity, CartItemEntity } from '../types/cart';
import { UpdateCartDto } from './dtos';

@Injectable()
export class CartService {
  constructor(
    private config: ConfigService,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity) private cartItemRepository: Repository<CartItemEntity>,

    @InjectRepository(ProductVariantEntity) private productVariantRepository: Repository<ProductVariantEntity>,
    @InjectRepository(ProductDetailEntity) private productDetailRepository: Repository<ProductDetailEntity>,
    @InjectRepository(ImageDetailEntity) private imageDetailRepository: Repository<ImageDetailEntity>,
    @InjectRepository(TagsEntity) private tagsRepository: Repository<TagsEntity>,
  ) { }

  async CreateCart() {
    const newCart = this.cartRepository.create({
    cartProducts: []
    });
    return await this.cartRepository.save(newCart);
  }

  async GetCartById(id: number) {
    const newCart = await this.cartRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'cartProducts',
        'cartProducts.product',
        'cartProducts.product.details',
        'cartProducts.product.details.imgDisplay',
        'cartProducts.product.details.brand',
        'cartProducts.productVariant',
        'cartProducts.productVariant.attributes',
      ],
    });
    if (!newCart) {
      throw new NotFoundException('Cart not found');
    }
    return newCart
  }
  async RefreshCart(user: UserEntity) {
    const newCart = await this.cartRepository.findOne({
      where: {
        id: user.cart.id,
      },
      relations: [
        'cartProducts',
        'cartProducts.product',
        'cartProducts.product.details',
        'cartProducts.product.details.imgDisplay',
        'cartProducts.product.details.brand',
        'cartProducts.productVariant',
        'cartProducts.productVariant.attributes',
      ],
    });

    if (!newCart) {
      throw new NotFoundException('Cart not found');
    }

    newCart.cartProducts = []
    return await this.cartRepository.save(newCart);
  }
    async UpdateCart(dto: UpdateCartDto, user: UserEntity) {
    const newCart = await this.cartRepository.findOne({
      where: {
        id: user.cart.id,
      },
      relations: [
        'cartProducts',
        'cartProducts.product',
        'cartProducts.product.details',
        'cartProducts.product.details.imgDisplay',
        'cartProducts.product.details.brand',
        'cartProducts.productVariant',
        'cartProducts.productVariant.attributes',
      ],
    });

    if (!newCart) {
      throw new NotFoundException('Cart not found');
    }

    const itemCart: CartItemEntity[] = []
    for (const cartProduct of dto.cartProducts) {
      const existingItem = newCart.cartProducts.find(
        (item) =>
          item.product.id === cartProduct.productId &&
          item.productVariant.id === cartProduct.productVariantId,
      );

      if (existingItem) {
        existingItem.quantity = cartProduct.quantity;
        const savedCartItem = await this.cartItemRepository.save(existingItem);
        itemCart.push(savedCartItem);
      } else {
        const product = await this.productRepository.findOne({
          where: { id: cartProduct.productId },
          relations: ['details','details.imgDisplay','details.brand']
        });
        const productVariant = await this.productVariantRepository.findOne({
          where: { id: cartProduct.productVariantId },
          relations: ['attributes']
        });

        if (!product || !productVariant) {
          throw new NotFoundException('Product or product variant not found');
        }
        if (cartProduct.quantity > productVariant.stockQuantity) {
          throw new ForbiddenException('Quantity is greater than stock quantity');
        }
        const newCartItem = this.cartItemRepository.create({
          quantity: cartProduct.quantity,
          cart: newCart,
          product,
          productVariant,
        });
        const savedCartItem = await this.cartItemRepository.save(newCartItem);
        itemCart.push(savedCartItem);
      }
    }
    newCart.cartProducts = itemCart
    return await this.cartRepository.save(newCart);
  }
}
