import { Field, Float, ID, InputType, Int } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

@InputType()
export class TagsDetailInp {
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    type?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    value?: string;
}

@InputType()
export class ProductVariantInp {
    @IsNotEmpty()
    @IsNumber()
    @Field(() => Float)
    originPrice: number;

    @IsNotEmpty()
    @IsNumber()
    @Field(() => Float)
    displayPrice: number;

    @IsOptional()
    @IsNumber()
    @Field(() => Int, { nullable: true })
    stockQuantity?: number;

    @IsOptional()
    @Field(() => [TagsDetailInp], { nullable: true })
    attributes?: TagsDetailInp[];
}

@InputType()
export class ProductDetailInp {
    @IsOptional()
    @Field(() => [ImageDetailInp], { nullable: true })
    imgDisplay?: ImageDetailInp[];

    @IsOptional()
    @Field(() => [ProductVariantInp])
    variants: ProductVariantInp[];

    @IsOptional()
    @Field(() => TagsDetailInp, { nullable: true })
    brand?: TagsDetailInp;

    @IsOptional()
    @Field(() => [TagsDetailInp], { nullable: true })
    attributes?: TagsDetailInp[];

    @IsOptional()
    @Field({ nullable: true })
    description?: string;

    @IsOptional()
    @Field({ nullable: true })
    tutorial?: string;
}

@InputType()
export class ImageDetailInp {
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    url?: string;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    link?: string[];
}

@InputType()
export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @Field()
    name: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    category?: string;

    @IsNotEmpty()
    @Field(() => ProductDetailInp)
    details: ProductDetailInp;
}
