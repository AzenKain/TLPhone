export type ItemSchemaProductDetailType = {
  id: string;
  isUseForSearch: boolean;
  value: string;
  productSchema?: SchemaProductDetailType[];
};

export type SchemaProductType = {
  id: string;
  name: string;
  isDisplay: boolean;
  category?: string | null;
  detail: SchemaProductDetailType[];
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type SchemaProductDetailType = {
  id: string;
  title: string;
  attributes: ItemSchemaProductDetailType[];
  schema?: SchemaProductType;
};
