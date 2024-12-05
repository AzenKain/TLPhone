import { ProductType } from './product';
import { RefundType } from './refund';
import { UserType } from './user';

export type CustomerInfoType = {
    id: number;
    userId?: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};

export type DeliveryInfoType = {
    id: number;
    deliveryType: string;
    deliveryFee: number;
    discount?: number;
    city?: string;
    district?: string;
    address: string;
};

export type PaymentInfoType = {
    id: number;
    isPaid: boolean;
    paymentType: string;
    bank?: string;
    trackId?: string;
    createdAt?: Date;
    updateAt?: Date;
};

export type OrderType = {
    id: number;
    isDisplay: boolean;
    paymentInfo: PaymentInfoType;
    totalAmount: number;
    orderProducts: OrderProductType[];
    deliveryInfo: DeliveryInfoType;
    customerInfo: CustomerInfoType;
    statusHistory: OrderStatusHistoryType[];
    status: string;
    notes?: string;
    created_at: Date;
    updated_at: Date;
};

export type VariantAttributeType = {
    type: string;
    value: string;
};

export type OrderStatusHistoryType = {
    id: number;
    previousStatus: string;
    newStatus: string;
    user: UserType;
    order: OrderType;
    createdAt: Date;
};

export type OrderProductType = {
    id: number;
    imei?: string;
    hasImei: boolean;
    unitPrice: number;
    originPrice?: number;
    quantity: number;
    discount?: number;
    order: OrderType;
    variantAttributes?: VariantAttributeType[];
    product: ProductType;
    refunds: RefundType[];
};
