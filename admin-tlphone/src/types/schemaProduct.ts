export type ItemSchemaProductDetailType = {
  id: number;
  isUseForSearch: boolean;
  value: string;
  productSchema?: SchemaProductDetailType[];
};

export type SchemaProductType = {
  id: number;
  name: string;
  isDisplay: boolean;
  category?: string;
  detail: SchemaProductDetailType[];
  created_at: Date;
  updated_at: Date;
};

export type SchemaProductDetailType = {
  id: number;
  title: string;
  attributes: ItemSchemaProductDetailType[];
  schema?: SchemaProductType;
};
