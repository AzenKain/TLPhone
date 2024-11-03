import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TagsDetailInp } from "./createProduct.dto";


@InputType()
export class SearchProductDto {
    @IsOptional() 
    @IsString()
    @Field({ nullable: true })
    name?: string;

    @IsOptional() 
    @Field(() => [Number], { nullable: true })
    rangeMoney?: number[]

    @IsOptional() 
    @Field(()=>[TagsDetailInp], { nullable: true })
    brand?: TagsDetailInp[];

    @IsOptional() 
    @IsNumber()
    @Field(() => Number, { nullable: true })
    index?: number

    @IsOptional() 
    @IsNumber()
    @Field(() => Number, { nullable: true })
    count?: number

    @IsOptional() 
    @IsString()
    @Field(() => String, { nullable: true })
    sort?: string

    @IsOptional() 
    @IsString()
    @Field(() => String, { nullable: true })
    hotSales?: string
}
