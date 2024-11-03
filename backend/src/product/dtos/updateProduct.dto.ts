import { Field, Float,  InputType, Int } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ProductDetailInp } from "./createProduct.dto";

@InputType()
export class UpdateProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  productId: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  category?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  buyCount?: number;

  @IsOptional()
  @Field(() => ProductDetailInp, { nullable: true })
  details?: ProductDetailInp;
}
