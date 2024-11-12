import { OrderProductType } from "./order";
import { ReviewType } from './review';
import { CampaignType } from './campaign';

export type TagsDetailType = {
  id: number;
  type: string;
  value?: string;
  productDetail?: ProductDetailType[];
  productVariant?: ProductVariantType[];
};

export type ProductVariantType = {
  id: number;
  attributes?: TagsDetailType[];
  originPrice: number;
  displayPrice: number;
  stockQuantity?: number;
  hasImei: boolean;
  imeiList?: string[];
};

export type ProductDetailType = {
  id: number;
  imgDisplay?: ImageDetailType[];
  variants?: ProductVariantType[];
  brand?: TagsDetailType;
  attributes?: TagsDetailType[];
  description?: string;
  tutorial?: string;
};

export type ImageDetailType = {
  id: number;
  url: string;
  link?: string[];
  productDetail?: ProductDetailType;
};

export type FaultyProductType = {
  id: number;
  quantity: number;
  imei?: string[];
  reason?: string[];
  notes?: string[];
  created_at: Date;
  updated_at: Date;
};

export type ProductType = {
  id: number;
  name: string;
  isDisplay: boolean;
  category?: string;
  buyCount?: number;
  details: ProductDetailType;
  orderProducts?: OrderProductType[];
  campaigns?: CampaignType[];
  reviews?: ReviewType[];
  created_at: Date;
  updated_at: Date;
  faultyProduct?: FaultyProductType;
};
