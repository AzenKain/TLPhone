import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { ProductType, ProductVariantType } from '../product';

@ObjectType('Cart')
export class CartType {
  @Field(() => ID)
  id: number;

  @Field(() => [CartItemType])
  cartProducts: CartItemType[];

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
@ObjectType('CartItem')
export class CartItemType {
  @Field(() => ID)
  id: number;

  @Field()
  quantity: number;

  @Field(() => CartType)
  cart: CartType;

  @Field(() => ProductType)
  product: ProductType;

  @Field(() => ProductVariantType)
  productVariant: ProductVariantType;
}