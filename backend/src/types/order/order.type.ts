import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { ProductType } from '../product';
import { RefundType } from '../refund';
import { UserType } from '../user';

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

  @Field(() => [OrderStatusHistoryType])
  statusHistory: OrderStatusHistoryType[];
  @Field()
  status: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}

@ObjectType('VariantAttribute')
export class VariantAttributeType {
  @Field()
  type: string;

  @Field()
  value: string;
}

@ObjectType('OrderStatusHistory')
export class OrderStatusHistoryType {
  @Field(() => ID)
  id: number;

  @Field()
  previousStatus: string;

  @Field()
  newStatus: string;

  @Field(() => UserType)
  user: UserType;

  @Field(() => OrderType)
  order: OrderType;

  @Field()
  createdAt: Date;
}

@ObjectType('OrderProduct')
export class OrderProductType {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  imei?: string;

  @Field({ nullable: true, defaultValue: false })
  hasImei: boolean;

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

  @Field(() => [VariantAttributeType], { nullable: true })
  variantAttributes?: VariantAttributeType[];

  @Field(() => ProductType)
  product: ProductType;

  @Field(() => [RefundType])
  refunds: RefundType[]
}
