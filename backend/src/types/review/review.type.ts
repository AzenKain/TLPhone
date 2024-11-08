import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ProductType } from '../product';
import { UserType } from '../user';

@ObjectType('Review')
export class ReviewType {
  @Field(() => ID)
  id: number;

  @Field()
  content: string;

  @Field()
  star: number;

  @Field()
  isDisplay: boolean;

  @Field(() => ProductType)
  product: ProductType;

  @Field(() => UserType)
  user: UserType;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
