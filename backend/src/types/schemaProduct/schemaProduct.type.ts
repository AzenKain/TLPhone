import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType('ItemSchemaProductDetail')
export class ItemSchemaProductDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    isUseForSearch: boolean;

    @Field()
    name: string;

}

@ObjectType('SchemaProductDetail')
export class SchemaProductDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    title: string;

    @Field(() => [ItemSchemaProductDetailType], { nullable: true })
    attributes: ItemSchemaProductDetailType[];
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
