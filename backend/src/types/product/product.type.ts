import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { OrderProductType } from "../order";
import { ReviewType } from '../review';
import { CampaignType } from '../campaign';

// TagsDetailType
@ObjectType('TagsDetail')
export class TagsDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    type: string;

    @Field({ nullable: true })
    value?: string;

    @Field(() => [ProductDetailType], { nullable: true })
    productDetail?: ProductDetailType[];

    @Field(() => [ProductVariantType], { nullable: true })
    productVariant?: ProductVariantType[];
}

// ProductVariantType
@ObjectType('ProductVariant')
export class ProductVariantType {
    @Field(() => ID)
    id: number;

    @Field(() => [TagsDetailType], { nullable: true })
    attributes?: TagsDetailType[];

    @Field(() => Float)
    originPrice: number;

    @Field(() => Float)
    displayPrice: number;

    @Field(() => Int, { nullable: true, defaultValue: 0 })
    stockQuantity?: number;

    @Field({nullable: true, defaultValue: false})
    hasImei: boolean;

    @Field(() => [String], { nullable: true })
    imeiList?: string[];
}

// ProductDetailType
@ObjectType('ProductDetail')
export class ProductDetailType {
    @Field(() => ID)
    id: number;

    @Field(() => [ImageDetailType], { nullable: true })
    imgDisplay?: ImageDetailType[];

    @Field(() => [ColorDetailType], { nullable: true })
    color?: ColorDetailType[];

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

// ImageDetailType
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

@ObjectType("ColorDetail")
export class ColorDetailType {
    @Field(() => ID)
    id: number;

    @Field()
    colorName: string;

    @Field({nullable : true})
    colorHex: string;

    @Field(() => ProductDetailType, { nullable: true })
    productDetail?: ProductDetailType;
}

// FaultyProductType
@ObjectType('FaultyProduct')
export class FaultyProductType {
    @Field(() => ID)
    id: number;

    @Field(() => Int)
    quantity: number;

    @Field(() => [String], { nullable: true })
    imei?: string[];

    @Field(() => [String], { nullable: true })
    reason?: string[];

    @Field(() => [String], { nullable: true })
    notes?: string[];

    @Field()
    created_at: Date;

    @Field()
    updated_at: Date;
}

// ProductType
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

    @Field(() => [OrderProductType], { nullable: true })
    orderProducts?: OrderProductType[];

    @Field(() => [CampaignType], { nullable: true })
    campaigns?: CampaignType[];

    @Field(() => [ReviewType], { nullable: true })
    reviews?: ReviewType[];

    @Field()
    created_at: Date;

    @Field()
    updated_at: Date;

    @Field(() => FaultyProductType, { nullable: true })
    faultyProduct?: FaultyProductType;
}
