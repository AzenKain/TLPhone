import { Field, Float, ID, InputType, } from "@nestjs/graphql";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

@InputType()
export class CustomerInfoInp {
  @IsNotEmpty()
  @IsString()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  phoneNumber: string;
}

@InputType()
export class DeliveryInfoInp {
  @IsOptional()
  @IsString()
  @Field({ nullable: false })
  deliveryType: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  city?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  district?: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  address: string;
}


@InputType()
export class createOrderDto {
  @IsNotEmpty()
  @Field(() => DeliveryInfoInp)
  deliveryInfo: DeliveryInfoInp;

  @IsNotEmpty()
  @Field(() => CustomerInfoInp)
  customerInfo: CustomerInfoInp;

  @IsNotEmpty()
  @IsString()
  @Field()
  paymentType: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  notes?: string;
}

