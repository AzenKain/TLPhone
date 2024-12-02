import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class ItemSchemaProductDto {
  @IsNotEmpty()
  @IsBoolean()
  @Field()
  isUseForSearch: boolean;

  @IsNotEmpty()
  @IsString()
  @Field()
  value: string;
}

@InputType()
export class CreateSchemaProductDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsOptional()
  @IsString()
  @Field()
  @Field({ nullable: true })
  category?: string;

  @IsOptional()
  @Field(() => [SchemaProductDetailDto], { nullable: true, defaultValue: [] })
  detail?: SchemaProductDetailDto[];
}

@InputType()
export class SchemaProductDetailDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsOptional()
  @Field(() => [ItemSchemaProductDto], { nullable: true, defaultValue:[] })
  attributes?: ItemSchemaProductDto[];
}

