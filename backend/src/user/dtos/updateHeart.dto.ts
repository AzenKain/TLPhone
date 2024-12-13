import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateHeartDto {
  @IsNotEmpty()
  @Field(() => [Number])
  heart: number[];
}
