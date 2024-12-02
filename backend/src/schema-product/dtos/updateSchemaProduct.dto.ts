import { Field, InputType, ID } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateItemSchemaProductDto {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  isUseForSearch?: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  value?: string;
}

@InputType()
export class UpdateSchemaProductDetailDto {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  title?: string;

  @IsOptional()
  @Field(() => [UpdateItemSchemaProductDto], { nullable: true })
  attributes?: UpdateItemSchemaProductDto[];
}

@InputType()
export class UpdateSchemaProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  schemaId: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  category?: string;

  @IsOptional()
  @Field(() => [UpdateSchemaProductDetailDto], { nullable: true, defaultValue: [] })
  detail?: UpdateSchemaProductDetailDto[];

}
