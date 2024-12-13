import {TagsDetailInp} from "@/lib/dtos/Product/tagsProduct.dto";

export type SearchProductDto = {
  name?: string;
  category?: string;
  rangeMoney?: number[];
  brand?: TagsDetailInp[];
  color?: TagsDetailInp[];
  attributes?: TagsDetailInp[];
  index: number;
  count: number;
  sort?: string;
  hotSales?: string;
};

