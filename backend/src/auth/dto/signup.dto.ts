import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    @Field()
    otpId: number

    @IsString()
    @IsNotEmpty()
    @Field()
    password: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    gender: string;
}