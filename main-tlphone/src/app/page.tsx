"use client"
import { maxHeaderSize } from "http";
import Image from 'next/image';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import "@/css/styles.css";
import BasicCard from "@/components/Card/BasicCard";
import BasicSlider from "@/components/Slider/BasicSlider";
import { Slider } from "@/types/slider";
import { Card } from "@/types";

export default function Home() {

  const ListPopular: Card[] = [{ id: 1, name: 'iPhone 14 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
  { id: 2, name: 'iPhone 14 Pro Max', discount: 10, price: 28990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
  { id: 2, name: 'iPhone 14 Pro Max', discount: 10, price: 28990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
  { id: 2, name: 'iPhone 14 Pro Max', discount: 10, price: 28990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
  { id: 2, name: 'iPhone 14 Pro Max', discount: 10, price: 28990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
  { id: 2, name: 'iPhone 14 Pro Max', discount: 10, price: 28990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
  { id: 2, name: 'iPhone 14 Pro Max', discount: 10, price: 28990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
  { id: 2, name: 'iPhone 14 Pro Max', discount: 10, price: 28990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },]
  const [clickMenu, setClickMenu] = useState<boolean>(false);
  const ListSlider: Slider[][] = [
    [
      { id: 1, name: 'iPhone 16 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://cdn-v2.didongviet.vn/files/products/2024/9/2/1/1727855468669_thumb_iphone_16_pro_didongviet.jpg' },
      { id: 2, name: 'iPhone 15 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://cdn-v2.didongviet.vn/files/products/2023/8/29/1/1695955479856_thumb_iphone_15_pro_didongviet.jpg' },
      { id: 3, name: 'iPhone 14 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
      { id: 4, name: 'iPhone 13 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
      { id: 5, name: 'iPhone 12 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
    ],
    [
      { id: 6, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
      { id: 7, name: 'iPhone X Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
      { id: 8, name: 'iPhone 8 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
      { id: 9, name: 'iPhone 7 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
      { id: 10, name: 'iPhone 6 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
    ]
  ]
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

  //item
  const items = ['IPhone 16 Pro Max', 'IPhone 15 Pro Max', 'Samsung Galaxy S24 FE', 'Samsung Galaxy Z Flip6', 'Samsung Galaxy A06', 'Xiaomi 14T Pro', 'Redmi 14C', 'OPPO Reno12 F', 'OPPO A18'];
  const image = ['/img/ip16.webp', '/img/ip15.webp', '/img/ssa16.webp', '/img/xiao14t.webp', '/img/tecno.webp']
  const items2 = ['IPhone 16 Pro Max 256GB Chính Hãng', 'IPhone 15 Pro Max 512GB Chính Hãng', 'Samsung Galaxy A16 128GB Chính Hãng', 'Xiaomi 14T 5G 512GB Chính Hãng', 'TECNO Pova 6Neo 128GB Chính Hãng'];
  const price = ['33.890.000 ', '23.990.000', '6.090.000', '12.590.000', '4.090.000']
  return (

    //  menu
    <div>
      <div onMouseLeave={() => setClickMenu(false)} className="mx-24 my-8">
        <div className=" grid grid-cols-6 gap-4">
          <div className="col-span-1">
            <div className="hidden lg:block">
              <div className="shadow-2 rounded-lg" style={{ width: "205px" }}>
                <div className='bg-white p-2 rounded-lg'>
                  <div className="px-2 py-2">
                    <h1 className="mt-9 font-bold" style={{ fontSize: "30px" }}>Danh mục</h1>
                    <div onMouseEnter={() => setClickMenu(true)} >
                      <div className="mt-10 flex gap-3">
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
          <div className="col-span-5">
            {clickMenu ?
              (
                <div className="w-full h-full rounded-sm" style={{ height: "388px", width: "1000px" }}>
                  <div className="grid grid-cols-7 gap-4" style={{ height: "388px" }}>
                    <div className="col-span-2 border-e">
                      <div className="p-3">
                        <h1 className="font-bold text-xl">Thương hiệu</h1>
                        <div className="mt-3 flex gap-16">
                          <ul className="grid gap-3 text-md">
                            <li className="hover:text-red-500"><Link href={"http://localhost:3000/search"}>IPhone</Link></li>
                            <li className="hover:text-red-500"><Link href={""}>Samsung</Link></li>
                            <li className="hover:text-red-500"><Link href={""}>OPPO</Link></li>
                            <li className="hover:text-red-500"><Link href={""}>Xiaomi</Link></li>
                          </ul>
                          <ul className="grid  text-md">
                            <li className="hover:text-red-500"><Link href={""}>Vertu</Link></li>
                            <li className="hover:text-red-500"><Link href={""}>realmi</Link></li>
                            <li className="hover:text-red-500"><Link href={""}>Haweii</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 border-e">
                      <div className="p-3">
                        <h1 className="font-bold text-xl">Dòng sản phẩm HOT</h1>
                        <ul className="mt-3 grid gap-3 text-md">
                          {items.map((item, index) => (
                            <li key={index} className="hover:text-red-500"><Link href={""} key={index}>{item}</Link></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="p-3">
                        <h1 className="font-bold text-xl">Sản phẩm giá gốc</h1>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {image.map((img, index) => (
                            <div key={index} style={{ alignItems: "center" }} className="flex gap-3">
                              <Image src={img} alt={`Image ${index + 1}`} width={60} height={60} />
                              <div>
                                <Link href="#" className="hover:text-red-500 text-sm">{items2[index]}</Link>
                                <p className="text-rose-700 text-sm">{price[index]}</p>
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
                <div className="grid grid-cols-5 gap-4 bg3">
                  <div className="col-span-4 rounded-lg" style={{ height: "max-content" }}>
                    <div className="relative">
                      <img
                        src={images[currentIndex]}
                        alt={`Slide ${currentIndex + 1}`}
                        className="w-full h-auto rounded-lg" />
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg text-white p-2 rounded-e-md">
                        &#10094;
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg text-white p-2 rounded-s-md">
                        &#10095;
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                          <span
                            key={index}
                            className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-400'}`}
                            onClick={() => setCurrentIndex(index)}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 rounded-lg bg3 " style={{ height: "max-content" }}>
                    <Link href={""}><img className="rounded-md mb-4" src="https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731460581097_14_5.png&w=1080&q=75" alt="" /></Link>
                    <Link href={""}><img className="rounded-md mb-4" src="https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F14%2F1%2F1731553493834_samsung_10.png&w=1080&q=75" alt="" /></Link>
                    <Link href={""}><img className="rounded-md" src="https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F8%2F27%2F1%2F1727409819906_giaa_baan_raaa_haan_398_x_252.jpg&w=1080&q=75" alt="" /></Link>
                  </div>
                </div>
              )
            }

          </div>
        </div >
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
              {ListSlider.map((item, index) => (
                <div key={index} id={`slide${index}`} className="carousel-item relative w-full">
                  <div className="grid grid-cols-5 gap-2 cursor-pointer">
                    {item.map((it, id) => (
                      <BasicSlider key={id} item={it} />
                    ))}
                  </div>
                  <div className="absolute left-0 right-0 top-1/2 flex -translate-y-1/2 transform justify-between px-4">
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
            <div className="grid grid-cols-5 gap-2 items-center">
              {ListPopular.slice(0, 5).map((item, index) => (
                <BasicCard key={index} item={item} />
              ))}
            </div>

          </div>

          {/* Slide 2 */}
          <div className=" relative w-full block shadow p-4 mt-4">
            <h1 className="mt-3 ml-3 text-xl font-bold text-red mb-2">Samsung Chính Hãng</h1>
            <div className="grid grid-cols-5 gap-2 items-center ">
              {ListPopular.slice(0, 5).map((item, index) => (
                <BasicCard key={index} item={item} />
              ))}
            </div>

          </div>

          {/* Slide 3 */}
          <div className="relative w-full block shadow p-4 mt-4">
            <h1 className="mt-3 ml-3 text-xl font-bold text-red mb-2">OPPO | Xiaomi | TECNO | realme | HONOR Chính Hãng</h1>
            <div className="grid grid-cols-5 gap-2 items-center">
              {ListPopular.slice(0, 5).map((item, index) => (
                <BasicCard key={index} item={item} />
              ))}
            </div>

          </div>

          {/* Slide 4 */}
          <div className="relative w-full block shadow p-4 mt-4">
            <h1 className="mt-3 ml-3 text-xl font-bold text-red mb-2">iPhone Cũ Giá Tốt</h1>
            <div className="grid grid-cols-5 gap-2 items-center">
              {ListPopular.slice(0, 5).map((item, index) => (
                <BasicCard key={index} item={item} />
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};