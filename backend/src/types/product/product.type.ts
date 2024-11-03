import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { OrderProductType } from "../order";
import { Column } from 'typeorm';

@ObjectType('TagsDetail')
export class TagsDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    type: string;

    @Field()
    value?: string;
}


@ObjectType('ProductVariant')
export class ProductVariantType {
    @Field(() => ID)
    id: number;

    @Field(() => [TagsDetailType])
    attributes: TagsDetailType[];

    @Field(() => Float)
    originPrice: number;

    @Field(() => Float)
    displayPrice: number;

    @Field(() => Int, { nullable: true, defaultValue: 0 })
    stockQuantity?: number;
}

@ObjectType('ProductDetail')
export class ProductDetailType {
    @Field(() => ID)
    id: number;

    @Field(() => [ImageDetailType], { nullable: true })
    imgDisplay?: ImageDetailType[];

    @Field(() => [ProductVariantType], { nullable: true })
    variants?: ProductVariantType[];

    @Field(() => TagsDetailType, { nullable: true })
    brand?: TagsDetailType;

    @Field(() => [TagsDetailType], { nullable: true })
    attributes?: TagsDetailType[];

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    tutorial?: string;
}

@ObjectType("ImageDetail")
export class ImageDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    url: string;

    @Field(() => [String], { nullable: true })
    link?: string[];

    @Field(() => ProductDetailType, { nullable: true })
    productDetail?: ProductDetailType;
}

@ObjectType('Product')
export class ProductType {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    isDisplay: boolean;

    @Field({ nullable: true })
    category?: string;

    @Field(() => Int, { nullable: true, defaultValue: 0 })
    buyCount?: number;

    @Field(() => ProductDetailType)
    details: ProductDetailType;

    @Field(() => [OrderProductType])
    orderProducts: OrderProductType[];

    @Field()
    created_at: Date;

    @Field()
    updated_at: Date;
}