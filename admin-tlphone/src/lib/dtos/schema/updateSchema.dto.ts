export type UpdateItemSchemaProductDto = {
  isUseForSearch?: boolean;
  value?: string;
};

export type UpdateSchemaProductDetailDto = {
  title?: string;
  attributes?: UpdateItemSchemaProductDto[];
};

export type UpdateSchemaProductDto = {
  schemaId: number;
  name?: string;
  category?: string;
  detail?: UpdateSchemaProductDetailDto[];
};
