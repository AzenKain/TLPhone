import { Field, ID, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class SearchOrderDto {
    @IsOptional()
    @IsString()
    @Field({nullable: true})
    orderId?: string;

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    status?: string;

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    email?: string;

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    firstName?: string;

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    lastName?: string;
    
    @IsOptional() 
    @Field(() => [Number], { nullable: true })
    rangeMoney?: number[]

    @IsOptional()
    @IsString()
    @Field({nullable: true})
    phoneNumber?: string;
    
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
}


@InputType()
export class GetOrderDto {
    @IsNotEmpty()
    @IsString()
    @Field()
    orderId: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    authId: string;
}