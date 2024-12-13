export type UpdateOrderDto = {
  orderId: number;
  status?: string;
  isPaid?: boolean;
};

export type ConfirmOrderInp = {
  orderProductId: number;
  imei: string[];
};

export type ConfirmOrderDto = {
  orderId: number;
  orderList: ConfirmOrderInp[];
};
