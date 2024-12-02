import { ProductDetailInp } from "@/lib/dtos/Product/createProduct.dto";

export type UpdateProductDto = {
  productId: number;
  name?: string;
  category?: string;
  buyCount?: number;
  details?: ProductDetailInp;
};
