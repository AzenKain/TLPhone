import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ItemSchemaProductDto {
  @Field()
  isUseForSearch: boolean;

  @Field()
  value: string;
}


@InputType()
export class SchemaProductDetailDto {
  @Field()
  title: string;

  @Field(() => [ItemSchemaProductDto], { nullable: true })
  attributes?: ItemSchemaProductDto[];
}

@InputType()
export class CreateSchemaProductDto {
  @Field()
  name: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => [SchemaProductDetailDto], { nullable: true })
  detail: SchemaProductDetailDto[];
}