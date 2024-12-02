export type ItemSchemaProductDto = {
  isUseForSearch: boolean;
  value: string;
};

export type SchemaProductDetailDto = {
  title: string;
  attributes?: ItemSchemaProductDto[];
};

export type CreateSchemaProductDto = {
  name: string;
  category?: string;
  detail: SchemaProductDetailDto[];
};
