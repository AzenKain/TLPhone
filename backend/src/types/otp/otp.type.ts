import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Otp')
export class OtpType {
  @Field(() => ID)
  id: number;

  @Field()
  isDisplay: boolean;

  @Field()
  email: string;

  @Field()
  otpCode: string;

  @Field()
  type: string;

  @Field()
  value: boolean;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}