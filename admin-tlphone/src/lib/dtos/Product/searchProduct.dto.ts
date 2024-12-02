export type SearchProductDto = {
  name?: string;
  rangeMoney?: number[];
  brand?: TagsDetailInp[];
  color?: TagsDetailInp[];
  attributes?: TagsDetailInp[];
  index?: number;
  count?: number;
  sort?: string;
  hotSales?: string;
};

export type TagsDetailInp = {
  type?: string;
  value?: string;
};
