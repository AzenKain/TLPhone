import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType('ItemSchemaProductDetail')
export class ItemSchemaProductDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    isUseForSearch: boolean;

    @Field()
    value: string;

    @Field(() => [SchemaProductDetailType], { nullable: true })
    productSchema?: SchemaProductDetailType[];
}

@ObjectType('SchemaProduct')
export class SchemaProductType {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    isDisplay: boolean;

    @Field({ nullable: true })
    category?: string;

    @Field(() => [SchemaProductDetailType], { nullable: true })
    detail: SchemaProductDetailType[];

    @Field()
    created_at: Date;

    @Field()
    updated_at: Date;
}
@ObjectType('SchemaProductDetail')
export class SchemaProductDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    title: string;

    @Field(() => [ItemSchemaProductDetailType], { nullable: true })
    attributes: ItemSchemaProductDetailType[];

    @Field(() => SchemaProductType, { nullable: true })
    schema?: SchemaProductType;
}