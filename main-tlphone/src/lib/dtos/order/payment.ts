export type GenerateVnpayPaymentDto = {
    method: string | null;
    orderUid: string | null;
};

export type GenerateVnpayPaymentResponse = {
    status: string;
    url: string;
};