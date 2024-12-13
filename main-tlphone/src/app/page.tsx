"use client"
import { maxHeaderSize } from "http";
import Image from 'next/image';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import "@/css/styles.css";
import { ProductType, SearchProductType, TagsDetailType} from "@/types";
import {useSession} from "next-auth/react";
import {getTagsProductApi, makeRequestApi, searchProductWithOptionsApi} from "@/lib/api";
import {AddAllAttributes, } from "@/app/redux/features/product/product.redux";
import { SearchProductDto, TagsDetailInp, TagsProductDto} from "@/lib/dtos/Product";
import BasicCard from "@/components/Card/BasicCard";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {Backend_URL} from "@/lib/Constants";

export default function Home() {
  const { data: session } = useSession();
  const [clickMenu, setClickMenu] = useState<boolean>(false);
  const [listIphone, setListIphone] = useState<ProductType[]>([])
  const [listSamsung, setListSamsung] = useState<ProductType[]>([])
  const [listOther, setListOther] = useState<ProductType[]>([])
  const [listSale, setListSale] = useState<ProductType[][]>([])
  const [listHot, setListHot] = useState<ProductType[]>([])
  const [listOrigin, setListOrigin] = useState<ProductType[]>([])
  const attributesList = useAppSelector(
      (state) => state.ProductRedux.attributesList,
  );
  const dispatch = useAppDispatch();
  const UpdateAllTag = async () => {
    const dtoTag: TagsProductDto = {
      tags: null,
    };
    const responseTags: TagsDetailType[] = await getTagsProductApi(dtoTag, null)

    dispatch(AddAllAttributes(responseTags));

  };

  const chunkArray = (array: ProductType[], chunkSize: number): ProductType[][] => {
    const chunks: ProductType[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let filter : SearchProductDto = {
          name: "",
          rangeMoney: [0, 100000000],
          index: 1,
          count: 20,
          sort: 'updated_at_desc',
          brand: [{type: 'brand', value: "iphone"}]
        }
        let responseProduct: SearchProductType = await searchProductWithOptionsApi(filter, null)

        setListIphone(responseProduct.data)

        filter.brand = [{type: 'brand', value: 'samsung'}]
        responseProduct = await searchProductWithOptionsApi(filter, null)
        setListSamsung(responseProduct.data)

        const otherBrand = ['honor', 'oppo', 'xiaomi', 'tecno', 'realme'];
        filter.brand = otherBrand.map(e => ({ type: 'brand', value: e } as TagsDetailInp));
        responseProduct = await searchProductWithOptionsApi(filter, null)
        setListOther(responseProduct.data)

        filter.brand = undefined;
        responseProduct = await searchProductWithOptionsApi(filter, null)

        const chunkedData = chunkArray(responseProduct.data, 5);
        setListSale(chunkedData)

        filter.count = 10
        responseProduct = await searchProductWithOptionsApi(filter, null)
        setListHot(responseProduct.data)

        filter.count = 5
        responseProduct = await searchProductWithOptionsApi(filter, null)
        setListOrigin(responseProduct.data)

        await UpdateAllTag()
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [session]);

  //slideshow
  const images = [
    'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75',
    'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731430895942_main_3.png&w=1080&q=75',
    'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731463978930_ip16_pro_max.png&w=1080&q=75',
    'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731485578770_pova_6_824x400_copy.png&w=1080&q=75'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  useEffect(() => {
    const intervalId = setInterval(nextImage, 3000);
    return () => clearInterval(intervalId);
  }, []);


  return (

    //  menu
    <div>
      <div onMouseLeave={() => setClickMenu(false)} className="mx-24 my-8">
        <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="col-span-1 lg:col-span-1">
            <div className="">
              <div className="shadow-2 rounded-lg" style={{ width: "205px" }}>
                <div className='bg-white p-2 rounded-lg'>
                  <div className="px-2 py-2">
                    <h1 className="mt-9 font-bold" style={{ fontSize: "30px" }}>Danh mục</h1>
                    <div onMouseEnter={() => setClickMenu(true)} >
                      <div className=" flex gap-3">
                        <Link href={"#"} className="mt-10 flex gap-2">
                          <Image src="/img/tlphone.avif" alt="" width={30} height={30} />
                          <h1 className="text-lg hover:text-red-500">Điện thoại</h1>
                        </Link>
                      </div>
                    </div>
                    <div className="mt-7 text-xl">
                      <Link href={"https://didongviet.vn/dchannel/khuyen-mai/"} className="mt-10 flex gap-2">
                        <Image src="/img/voucher.avif" alt="" width={30} height={35} />
                        <h1 className="text-lg mt-1 hover:text-red-500">Khuyến mãi</h1>
                      </Link>
                    </div>
                    <div className="mt-7 text-xl">
                      <Link href={"https://didongviet.vn/dchannel/"} className="mt-10 flex gap-2">
                        <Image src="/img/newspaper.avif" alt="" width={30} height={35} />
                        <h1 className="text-lg mt-1 hover:text-red-500">Công nghệ</h1>
                      </Link>
                    </div>
                    <div className="mt-7 text-xl pb-8">
                      <Link href={""} className="mt-10 flex gap-2 ms-1">
                        <Image src="/img/lienhe.png" alt="" width={25} height={25} />
                        <h1 className="text-lg mt-1 ms-1 hover:text-red-500">Liên hệ</h1>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-5">
            {clickMenu ?
              (
                <div className="w-full h-full rounded-sm" style={{ height: "388px", width: "1000px" }}>
                  <div className="grid grid-cols-7 gap-4" style={{ height: "388px" }}>
                    <div className="col-span-2 border-e">
                      <div className="p-3">
                        <h1 className="font-bold text-xl">Thương hiệu</h1>
                        <div className="mt-3 flex gap-16">
                          <ul className="grid grid-cols-2 gap-2 text-md">
                            {attributesList.filter(it => it.type == 'brand').map((it) => {
                              return (
                                  <li key={it.id} className="hover:text-red-500"><Link href={"/search"}>{it.value}</Link></li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 border-e">
                      <div className="p-3">
                        <h1 className="font-bold text-xl">Dòng sản phẩm HOT</h1>
                        <ul className="mt-3 grid gap-3 text-md">
                          {listHot.map((item, index) => (
                            <li key={item.id} className="hover:text-red-500"><Link href={`/product/${item.id}`}>{item?.name || ""}</Link></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="p-3">
                        <h1 className="font-bold text-xl">Sản phẩm giá gốc</h1>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {listOrigin.map((item, index) => (
                            <div key={item.id} style={{ alignItems: "center" }} className="flex gap-3">
                              <Link href={`/product/${item.id}`}>
                                <Image src={item.details?.imgDisplay?.[0]?.url ? Backend_URL + item.details?.imgDisplay?.[0]?.url : "./no-item-found.png"} alt={`Image ${index + 1}`} width={60} height={60} />
                              </Link>
                                <div>
                                <Link href={`/product/${item.id}`} className="hover:text-red-500 text-sm">{item?.name || ""}</Link>
                                <p className="text-rose-700 text-sm">
                                  {item.details?.variants?.[0]?.displayPrice
                                    ? (item.details?.variants?.[0]?.displayPrice * (100 - 0) / 100).toLocaleString('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                    })
                                    : 'N/A'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) :
                (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div
                          className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 rounded-lg flex flex-col items-center">
                        <div className="flex items-center justify-between w-full">
                          <button
                              onClick={prevImage}
                              className="bg text-white p-2 rounded-md">
                            &#10094;
                          </button>
                          <img
                              src={images[currentIndex]}
                              alt={`Slide ${currentIndex + 1}`}
                              className="w-full h-auto rounded-lg max-w-[calc(100%-4rem)]"
                          />
                          <button
                              onClick={nextImage}
                              className="bg text-white p-2 rounded-md">
                            &#10095;
                          </button>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          {images.map((_, index) => (
                              <span
                                  key={index}
                                  className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-400'}`}
                                  onClick={() => setCurrentIndex(index)}
                              ></span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 lg:grid-cols-1 col-span-3 lg:col-span-1 rounded-lg gap-4">
                        <Link href={""}>
                          <img
                              className="rounded-md"
                              src="https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731460581097_14_5.png&w=1080&q=75"
                              alt=""
                          />
                        </Link>
                        <Link href={""}>
                          <img
                              className="rounded-md"
                              src="https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F14%2F1%2F1731553493834_samsung_10.png&w=1080&q=75"
                              alt=""
                          />
                        </Link>
                        <Link href={""}>
                          <img
                              className="rounded-md"
                              src="https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F8%2F27%2F1%2F1727409819906_giaa_baan_raaa_haan_398_x_252.jpg&w=1080&q=75"
                              alt=""
                          />
                        </Link>
                      </div>
                    </div>

                )
            }

          </div>
        </div>
        {/* Slider */}
        <div className="my-6 flex justify-center">
          <div className="bg-red-900 p-6 rounded-lg max-w-7xl shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-4 text-white text-sm -mt-2">
              <button className="bg-red-700 px-4 py-2 rounded-md">
                DEAL SỐC HÔM NAY
              </button>
              {/* <button className="bg-red-700 px-4 py-2 rounded-md">
            ONLY ONLINE GIẢM ĐẾN 40%
          </button> */}
            </div>

            {/* Carousel */}
            <div className="carousel w-full mt-4">
              {listSale.map((item, index) => (
                  <div key={index} id={`slide${index}`} className="carousel-item relative w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 cursor-pointer">
                      {item.map((it, id) => (
                          <BasicCard key={id} item={it}/>
                      ))}
                    </div>
                    <div
                        className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 transform justify-between px-4">
                      <a href={`#slide${index - 1}`} className="btn btn-circle bg-white text-black border-none">❮</a>
                      <a href={`#slide${index + 1}`} className="btn btn-circle bg-white text-black border-none">❯</a>
                    </div>
                  </div>
              ))}
            </div>

          </div>
        </div>
        {/*itempopular*/}
        <div className=" w-full gap-8">

          {/* Slide 1 */}
          <div className=" relative w-full h-full block shadow p-4 mt-4">
            <h1 className="mt-3 ml-3 text-xl font-bold text-red mb-2">iPhone Chính Hãng (Apple Authorized Reseller)</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 items-center">
              {listIphone.slice(0, 5).map((item, index) => (
                <BasicCard key={index} item={item} />
              ))}
            </div>

          </div>

          {/* Slide 2 */}
          <div className=" relative w-full block shadow p-4 mt-4">
            <h1 className="mt-3 ml-3 text-xl font-bold text-red mb-2">Samsung Chính Hãng</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 items-center ">
              {listSamsung.slice(0, 5).map((item, index) => (
                <BasicCard key={index} item={item} />
              ))}
            </div>

          </div>

          {/* Slide 3 */}
          <div className="relative w-full block shadow p-4 mt-4">
            <h1 className="mt-3 ml-3 text-xl font-bold text-red mb-2">OPPO | Xiaomi | TECNO | realme | HONOR Chính Hãng</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 items-center">
              {listOther.slice(0, 5).map((item, index) => (
                <BasicCard key={index} item={item} />
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};