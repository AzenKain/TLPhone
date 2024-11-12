'use client'
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductBox from "@/components/Products/Product";

const ProductPage = () => {
  return (
    <DefaultLayout>
      <ProductBox />
    </DefaultLayout>
  );
};

export default ProductPage;
