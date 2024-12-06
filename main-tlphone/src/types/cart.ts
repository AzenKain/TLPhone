import { ProductType, ProductVariantType } from './product';

export type CartType = {
  id: string;
  cartProducts: CartItemType[];
  created_at: Date;
  updated_at: Date;
};

export type CartItemType = {
  id: string;
  quantity: number;
  cart: CartType;
  product: ProductType;
  productVariant: ProductVariantType;
};
