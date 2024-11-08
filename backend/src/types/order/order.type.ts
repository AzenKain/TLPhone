import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { ProductType } from '../product';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType('CustomerInfo')
export class CustomerInfoType {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  userId: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phoneNumber: string;
}

@ObjectType('DeliveryInfo')
export class DeliveryInfoType {
  @Field(() => ID)
  id: number;

  @Field({ nullable: false })
  deliveryType: string;

  @Field(() => Float)
  deliveryFee: number;

  @Field(() => Float)
  discount?: number;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  district?: string;

  @Field()
  address: string;
}

@ObjectType('PaymentInfo')
export class PaymentInfoType {
  @Field(() => ID)
  id: number;

  @Field()
  isPaid: boolean;

  @Field()
  paymentType: string;

  @Field({ nullable: true })
  bank?: string;

  @Field({ nullable: true })
  trackId?: string;

  @Field()
  createdAt?: Date;

  @Field()
  updateAt?: Date;
}

@ObjectType('Order')
export class OrderType {
  @Field(() => ID)
  id: number;

  @Field()
  isDisplay: boolean;

  @Field(() => PaymentInfoType)
  paymentInfo: PaymentInfoType;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => [OrderProductType])
  orderProducts: OrderProductType[];

  @Field(() => DeliveryInfoType)
  deliveryInfo: DeliveryInfoType;

  @Field(() => CustomerInfoType)
  customerInfo: CustomerInfoType;

  @Field()
  status: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}

@ObjectType('OrderProduct')
export class OrderProductType {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  orderId: number;

  @Field(() => ID)
  productId: number;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Float, { nullable: true })
  originPrice: number;

  @Field()
  quantity: number;

  @Field(() => Float)
  discount?: number;

  @Field(() => OrderType)
  order: OrderType;

  @Field(() => ProductType)
  product: ProductType;
}
