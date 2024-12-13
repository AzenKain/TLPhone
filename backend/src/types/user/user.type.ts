import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ReviewType } from '../review';
import { CartType } from '../cart';
import { OrderStatusHistoryType } from '../order';

@ObjectType('UserDetail')
export class UserDetailType {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  birthday?: Date;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  imgDisplay?: string;
}

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field()
  secretKey: string;

  @Field()
  isDisplay: boolean;

  @Field(() => [String])
  role: string[];

  @Field(() => [Number])
  heart: number[];

  @Field(() => UserDetailType, { nullable: true })
  details: UserDetailType;

  @Field(() => [OrderStatusHistoryType],{ nullable: true, defaultValue: [] })
  statusHistory?: OrderStatusHistoryType[]

  @Field(() => CartType)
  cart: CartType

  @Field({ nullable: true })
  hash: string;

  @Field({ nullable: true })
  refreshToken: string;

  @Field(() => [ReviewType],{ nullable: true, defaultValue: [] })
  reviews: ReviewType[];

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
