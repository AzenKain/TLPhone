import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtGuardGraphql } from '../auth/guard';
import { CartService } from './cart.service';
import { UserEntity  } from '../types/user';
import { CurrentUserGraphql } from '../decorators';
import { CartType } from '../types/cart';
import { UpdateCartDto } from './dtos';

@UseGuards(JwtGuardGraphql)
@Resolver()
export class CartResolver {
  constructor(
    private cartService: CartService,
  ) { }

  @Mutation(() => CartType)
  async UpdateCart(
    @CurrentUserGraphql() user: UserEntity,
    @Args('UpdateCart') dto: UpdateCartDto,
  ): Promise<CartType> {
    return await this.cartService.UpdateCart(dto, user)
  }
}
