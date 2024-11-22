import { UserType } from '../user';
import { OrderProductType } from '../order';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType("Refund")
export class RefundType {
  @Field(() => ID)
  id: number;

  @Field()
  reason: string;

  @Field()
  isDisplay: boolean;

  @Field(() => UserType)
  user: UserType;

  @Field(() => OrderProductType)
  orderProduct: OrderProductType;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
