import { Field, ID, InputType } from "@nestjs/graphql";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  userId: string;

  @IsNotEmpty()
  @Field(() => [String])
  role: string[];
}
