import { InputType, Field} from "@nestjs/graphql";
import { IsNotEmpty, IsNumber } from "class-validator";

@InputType()
export class DeleteBlogDto {
    @IsNotEmpty()
    @IsNumber()
    @Field()
    blogId: number;
}