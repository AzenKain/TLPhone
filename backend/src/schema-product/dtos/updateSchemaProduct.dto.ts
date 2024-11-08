import { Field, InputType, ID } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdateItemSchemaProductDto {
  @Field({ nullable: true })
  isUseForSearch?: boolean;

  @Field({ nullable: true })
  value?: string;
}

@InputType()
export class UpdateSchemaProductDetailDto {
  @Field({ nullable: true })
  title?: string;

  @Field(() => [UpdateItemSchemaProductDto], { nullable: true })
  attributes?: UpdateItemSchemaProductDto[];
}

@InputType()
export class UpdateSchemaProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  schemaId: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => [UpdateSchemaProductDetailDto], { nullable: true })
  detail?: UpdateSchemaProductDetailDto[];

  @Field(() => ID, { nullable: true })
  productId?: number;
}
