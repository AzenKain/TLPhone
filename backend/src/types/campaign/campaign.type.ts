import { Field, Float, ID, ObjectType, Int } from '@nestjs/graphql';
import { ProductType } from '../product';

@ObjectType('Campaign')
export class CampaignType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field(() => Float)
  discountPercent: number;

  @Field(() => Float, { nullable: true })
  discountAmount?: number;

  @Field(() => Float)
  maxDiscountAmount: number;

  @Field(() => Float)
  minDiscountAmount: number;

  @Field()
  hasBanner: boolean;

  @Field({ nullable: true })
  bannerUrl?: string;

  @Field(() => [ProductType])
  products: ProductType[];

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
