export type SearchOrderDto = {
  orderId?: string;
  status?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  rangeMoney?: number[];
  phoneNumber?: string;
  index: number;
  count: number;
  sort?: string;
};
