export type GenerateVnpayPaymentDto = {
    method: string | null;
    orderUid: string | null;
};

export type GenerateVnpayPaymentResponse = {
    url: string;
};


export type GetOrderDto = {
    orderId: string;
    authId: string;
}