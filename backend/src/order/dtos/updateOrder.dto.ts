import { Field, InputType } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

@InputType()
export class updateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  orderId: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  status?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  isPaid?: boolean;

}
@InputType()
export class confirmOrderInp {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  orderProductId: number;

  @IsNotEmpty()
  @Field(()=> [String])
  imei: string[];
}
@InputType()
export class confirmOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  orderId: number;

  @IsNotEmpty()
  @Field(() => [confirmOrderInp])
  orderList: confirmOrderInp[]
}

