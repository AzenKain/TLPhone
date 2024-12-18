import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtGuardGraphql } from 'src/auth/guard';
import { OrderType, SearchOrderType } from 'src/types/order';
import { UserEntity } from 'src/types/user';
import { confirmOrderDto, createOrderDto, GetOrderDto, SearchOrderDto, updateOrderDto } from './dtos';
import { OrderService } from './order.service';
import { CurrentUserGraphql } from 'src/decorators';


@Resolver()
export class OrderResolver {
    constructor(
        private readonly orderService: OrderService,
    ) { }
    @UseGuards(JwtGuardGraphql)
    @Query(() => SearchOrderType)
    async SearchOrderWithOption(
        @CurrentUserGraphql() user: UserEntity,
        @Args('SearchOrder') dto: SearchOrderDto
    ): Promise<SearchOrderType> { 
        return await this.orderService.SearchOrderWithOptionsServices(dto, user)
    }

    @Query(() => OrderType)
    async GetOrderById(
      @Args('GetOrderById') dto: GetOrderDto,
    ): Promise<OrderType> { 
        return await this.orderService.GetOrderById(dto)
    }
    @UseGuards(JwtGuardGraphql)
    @Query(() => [OrderType])
    async GetOrderListByUser(
      @CurrentUserGraphql() user: UserEntity,
    ): Promise<OrderType[]> {
        return await this.orderService.GetListOrderByUser(user)
    }
    @UseGuards(JwtGuardGraphql)
    @Mutation(() => OrderType)
    async CreateOrder(
        @CurrentUserGraphql() user: UserEntity,
        @Args('CreateOrder') dto: createOrderDto
    ): Promise<OrderType> {
        return await this.orderService.CreateOrderService(dto, user)
    }
    @UseGuards(JwtGuardGraphql)
    @Mutation(() => [OrderType])
    async CreateListOrder(
        @CurrentUserGraphql() user: UserEntity,
        @Args({ name: 'CreateOrder', type: () => [createOrderDto] }) dto: createOrderDto[]
    ): Promise<OrderType[]> {
        return await this.orderService.CreateOrderByListService(dto, user)
    }
    @UseGuards(JwtGuardGraphql)
    @Mutation(() => OrderType)
    async UpdateOrder(
        @CurrentUserGraphql() user: UserEntity,
        @Args('UpdateOrder') dto: updateOrderDto
    ): Promise<OrderType> {
        return await this.orderService.UpdateOrderService(dto, user)
    }
    @UseGuards(JwtGuardGraphql)
    @Mutation(() => OrderType)
    async ConfirmOrder(
      @CurrentUserGraphql() user: UserEntity,
      @Args('ConfirmOrder') dto: confirmOrderDto
    ): Promise<OrderType> {
        return await this.orderService.ConfirmOrderService(dto, user)
    }
}
