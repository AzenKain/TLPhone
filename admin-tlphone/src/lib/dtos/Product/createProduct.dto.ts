export type TagsDetailInp = {
  type?: string;
  value?: string;
};

export type ProductVariantInp = {
  hasImei?: boolean;
  imeiList?: string[];
  originPrice: number;
  displayPrice: number;
  stockQuantity?: number;
  attributes?: TagsDetailInp[];
};

export type ImageDetailInp = {
  url?: string;
  link?: string[];
};

export type ColorDetailInp = {
  colorName?: string | null;
  colorHex?: string | null;
};

export type ProductDetailInp = {
  imgDisplay?: ImageDetailInp[];
  color?: ColorDetailInp[];
  variants?: ProductVariantInp[];
  brand?: TagsDetailInp;
  attributes?: TagsDetailInp[];
  description?: string;
  tutorial?: string;
};

export type CreateProductDto = {
  name: string;
  category?: string;
  details: ProductDetailInp;
};
