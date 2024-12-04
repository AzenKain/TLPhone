import { Field, Float, ID, InputType, Int } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

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

    @IsOptional()
    @IsBoolean()
    @Field({nullable: true,})
    hasImei: boolean;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    imeiList?: string[];

    @IsNotEmpty()
    @IsNumber()
    @Field(() => Float)
    originPrice: number;

    @IsNotEmpty()
    @IsNumber()
    @Field(() => Float)
    displayPrice: number;

    @IsNotEmpty()
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
    @Field(() => [ColorDetailInp], { nullable: true })
    color?: ColorDetailInp[];

    @IsOptional()
    @Field(() => [ProductVariantInp], { nullable: true })
    variants?: ProductVariantInp[];

    @IsOptional()
    @Field(() => TagsDetailInp, { nullable: true })
    brand?: TagsDetailInp;

    @IsOptional()
    @Field(() => [TagsDetailInp], { nullable: true })
    attributes?: TagsDetailInp[];

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    description?: string;

    @IsOptional()
    @IsString()
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
export class ColorDetailInp {
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    colorName?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    colorHex?: string;
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
