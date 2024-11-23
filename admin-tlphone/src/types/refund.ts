import { UserType } from './user';
import { OrderProductType } from './order';

export type RefundType = {
  id: number;
  reason: string;
  isDisplay: boolean;
  user: UserType;
  orderProduct: OrderProductType;
  created_at: Date;
  updated_at: Date;
};
