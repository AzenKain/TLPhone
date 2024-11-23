import { Field, ID, InputType } from "@nestjs/graphql";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  firstName: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  lastName: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  phoneNumber?: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  birthday?: Date

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  address?: string

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  gender?: string


  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  imgDisplay?: string
}
