import { ProductType } from './product';

export type CampaignType = {
  id: number;
  name: string;
  startTime: Date;
  endTime: Date;
  discountPercent: number;
  discountAmount?: number;
  maxDiscountAmount: number;
  minDiscountAmount: number;
  hasBanner: boolean;
  bannerUrl?: string;
  products: ProductType[];
  created_at: Date;
  updated_at: Date;
};
