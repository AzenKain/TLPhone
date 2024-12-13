import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class PaymentDto {
    @IsNotEmpty()
    @IsString()
    @Field()
    method: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    orderUid: string;
}