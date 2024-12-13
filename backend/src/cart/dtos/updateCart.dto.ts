import { Field, InputType} from '@nestjs/graphql';
import { IsNotEmpty, IsNumber} from 'class-validator';

@InputType()
export class UpdateCartDto {
  @IsNotEmpty()
  @Field(() => [CartItemInp])
  cartProducts: CartItemInp[];

}
@InputType()
export class CartItemInp {

  @IsNotEmpty()
  @IsNumber()
  @Field()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  productVariantId: number;
}