import { ProductType, ProductVariantType } from './product';

export type CartType = {
  id: number;
  cartProducts: CartItemType[];
  created_at: Date;
  updated_at: Date;
};

export type CartItemType = {
  id: number;
  quantity: number;
  cart: CartType;
  product: ProductType;
  productVariant: ProductVariantType;
};
