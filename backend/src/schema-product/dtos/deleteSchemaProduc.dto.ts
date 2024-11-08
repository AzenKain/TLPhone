import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class DeleteSchemaProductDto{
  @IsNotEmpty()
  @IsNumber()
  @Field()
  schemaId : number;
}
