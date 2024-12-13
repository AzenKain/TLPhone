export type CreateOrderDto = {
    customerInfo: CustomerInfoInp;
    deliveryInfo: DeliveryInfoInp;
    paymentType: string;
    notes?: string;
};

export type CustomerInfoInp = {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};

export type DeliveryInfoInp = {
    deliveryType: string;
    city?: string;
    district?: string;
    address: string;
};