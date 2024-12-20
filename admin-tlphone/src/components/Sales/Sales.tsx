"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { ProductType, SearchProductType } from "@/types/product";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Backend_URL } from "@/lib/Constants";
import { SearchProductDto } from "@/lib/dtos/Product";
import { searchProductWithOptionsApi } from "@/lib/api";

const SalesBox = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [dataHotSale, setDataHotSale] = useState<ProductType[]>([]);
  const [dataNewArrival, setDataNewArrival] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let filter: SearchProductDto = {
        name: "",
        rangeMoney: [0, 100000000],
        index: 1,
        count: 10,
        sort: "updated_at_desc",
      };
      let responseProduct: SearchProductType =
        await searchProductWithOptionsApi(filter, null);
      setDataHotSale(responseProduct.data);
      filter = {
        name: "",
        rangeMoney: [0, 100000000],
        index: 1,
        count: 10,
        sort: "created_at_desc",
      };
      responseProduct = await searchProductWithOptionsApi(filter, null);
      setDataNewArrival(responseProduct.data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Top sales
          </h4>
        </div>

        <div className="grid grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Product Name</p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Category</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Sold</p>
          </div>
        </div>

        {dataHotSale.map((product, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-12.5 w-15 rounded-md">
                  <Image
                    src={
                      product?.details?.imgDisplay?.length
                        ? Backend_URL + product.details.imgDisplay[0].url
                        : ""
                    }
                    width={60}
                    height={50}
                    alt="Product"
                  />
                </div>
                <p className="text-sm text-black dark:text-white">
                  {product?.name}
                </p>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {product?.details?.brand?.value}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-meta-3">{product?.buyCount}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            New arrivals
          </h4>
        </div>

        <div className="grid grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-3 flex items-center">
            <p className="font-medium">Product Name</p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Category</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Sold</p>
          </div>
        </div>

        {dataNewArrival.map((product, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-12.5 w-15 rounded-md">
                  <Image
                    src={
                      product?.details?.imgDisplay?.length
                        ? Backend_URL + product.details.imgDisplay[0].url
                        : ""
                    }
                    width={60}
                    height={50}
                    alt="Product"
                  />
                </div>
                <p className="text-sm text-black dark:text-white">
                  {product?.name}
                </p>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {product?.details?.brand?.value}
              </p>
            </div>

            <div className="col-span-1 flex items-center">
              <p className="text-sm text-meta-3">{product?.buyCount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesBox;
