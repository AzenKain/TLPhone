import { ProductType } from './product';
import { UserType } from './user';

export type ReviewType = {
  id: number;
  content: string;
  star: number;
  isDisplay: boolean;
  product: ProductType;
  user: UserType;
  created_at: Date;
  updated_at: Date;
};
