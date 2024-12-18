import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class ForgetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  otpId: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}