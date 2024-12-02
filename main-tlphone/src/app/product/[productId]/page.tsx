"use client"
import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/listproduct";
import BasicProduct from "@/components/Listproduct/BasicProduct";

const ProductPage = () => {
  const images = [
    "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75",
    "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731430895942_main_3.png&w=1080&q=75",
    "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731463978930_ip16_pro_max.png&w=1080&q=75",
    "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731485578770_pova_6_824x400_copy.png&w=1080&q=75",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOption, setSelectedOption] = useState("256GB");
  const Listproduct: Product[] =
    [
      { id: 1, name: 'iPhone 16 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://cdn-v2.didongviet.vn/files/products/2024/9/2/1/1727855468669_thumb_iphone_16_pro_didongviet.jpg' },
      { id: 2, name: 'iPhone 15 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
      { id: 3, name: 'iPhone 13 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
      { id: 4, name: 'iPhone 12 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
      { id: 5, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
    ]
  const specificationsoriginal = [
    {
      category: "Màn hình",
      details: [
        { label: "Độ phân giải", value: "2868x1320 pixel" },
        { label: "Màn hình rộng", value: "OLED 6.9 inch" },
        { label: "Công nghệ màn hình", value: "Super Retina XDR" },
      ],
    },
    {
      category: "Camera sau",
      details: [
        { label: "Độ phân giải", value: "Fusion 48MP, Ultra Wide 48MP, Telephoto 5x 12MP" },
      ],
    },
    {
      category: "Camera trước",
      details: [
        { label: "Độ phân giải", value: "12MP" },
        { label: "Tính năng", value: "Camera TrueDepth hỗ trợ nhận diện khuôn mặt" },
      ],
    },
    {
      category: "Hệ điều hành & CPU",
      details: [
        { label: "Chip đồ họa (GPU)", value: "GPU 6 lõi mới" },
        { label: "Hệ điều hành", value: "iOS 18" },
        { label: "Chip xử lý (CPU)", value: "Chip A18 Pro" },
        {
          label: "Tốc độ CPU",
          value: "CPU 6 lõi mới với 2 lõi hiệu năng và 4 lõi tiết kiệm điện",
        },
      ],
    },
    {
      category: "Bộ nhớ & Lưu trữ",
      details: [
        { label: "RAM", value: "Đang cập nhật" },
        { label: "Bộ nhớ trong", value: "256GB" },
      ],
    },
  ];
  const specifications = [
    {
      category: "Kết nối",
      details: [
        { label: "SIM", value: "SIM kép (nano-SIM và eSIM) - Hỗ trợ hai eSIM" },
        { label: "Wifi", value: "Wi-Fi 7 (802.11be) với 2x2 MIMO" },
        {
          label: "Định vị GPS",
          value: "GPS tần số kép chuẩn xác (GPS, GLONASS, Galileo, QZSS, BeiDou và NavIC)",
        },
        { label: "Cổng kết nối/sạc", value: "USB-C - USB 3 (lên đến 10Gb/s)11" },
        { label: "Bluetooth", value: "Bluetooth 5.3" },
        { label: "Kết nối mạng", value: "5G (sub-6 GHz) với 4x4 MIMO" },
      ],
    },
    {
      category: "Pin & Sạc",
      details: [{ label: "Dung lượng pin", value: "Đang cập nhật" }],
    },
    {
      category: "Tiện ích",
      details: [
        { label: "Kháng nước, bụi", value: "IP68" },
        { label: "Tính năng đặc biệt", value: "SOS Khẩn, Cấp Phát Hiện Va Chạm" },
      ],
    },
    {
      category: "Thiết kế",
      details: [
        { label: "Kích thước", value: "Dài 163 mm - Ngang 77.6 mm - Dày 8.25 mm" },
        { label: "Trọng lượng", value: "227 gram" },
      ],
    },
  ];

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const goToSlide = (index: any) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    setCurrentSlide(index);
  };

  return (
    <div className="container mx-24 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Carousel */}
        <div className="border p-4 rounded-lg">
          <div className="carousel w-full relative">
            <img
              src={images[currentSlide]}
              alt={`Product ${currentSlide + 1}`}
              className="w-full h-auto rounded-lg"
            />
            <button
              className="btn btn-circle absolute left-2 top-1/2 transform -translate-y-1/2"
              onClick={() => goToSlide(currentSlide - 1)}
            >
              ❮
            </button>
            <button
              className="btn btn-circle absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => goToSlide(currentSlide + 1)}
            >
              ❯
            </button>
          </div>
        </div>


        <div className="border p-4 rounded-lg space-y-4">
          <h1 className="text-2xl font-bold">
            iPhone 16 Pro Max 256GB Chính Hãng (VN/A)
          </h1>
          <div className="space-y-2">
            <p className="text-lg text-red-600 font-bold">
              33.690.000 đ{" "}
              <span className="line-through text-gray-500">34.990.000 đ</span>
            </p>

          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Tùy chọn:</h2>
            <div className="flex space-x-2">
              {["128GB", "256GB", "512GB", "1TB"].map((option) => (
                <button
                  key={option}
                  className={`px-3 py-2 border rounded-lg ${selectedOption === option
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-200"
                    }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              {["Xanh", "Vàng", "Đen", "Trắng", "Titan"].map((option) => (
                <button
                  key={option}
                  className={`px-3 py-2 border rounded-lg ${selectedOption === option
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-200"
                    }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>

          </div>

          <div className="flex space-x-2">
            {["Mua Ngay", "Thêm Vào Giỏ Hàng"].map((option) => (
              <button
                key={option}
                className={`px-3 py-2 border rounded-lg ${selectedOption === option
                  ? "bg-red-500 text-white"
                  : "hover:bg-gray-200"
                  }`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="mt-8 border p-4 rounded-lg">
        <h2 className="text-xl font-bold">Thông tin sản phẩm</h2>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Máy mới nguyên seal 100%, chính hãng Apple Việt Nam.</li>
          <li>Di Động Việt là đại lý ủy quyền chính thức của Apple Việt Nam.</li>
          <li>
            Bộ sản phẩm: Thân máy, Hộp, Cáp, Cây lấy sim, Sách hướng dẫn.
          </li>
          <li>Bảo hành chính hãng 12 tháng, đổi mới trong vòng 33 ngày.</li>
        </ul>
      </div>
      <div >
        <div className="w-full gap-8">
          {/* Slide 1 */}
          <div className="relative w-full h-full shadow-lg p-6 border rounded-lg bg-white">
            <h1 className="text-xl font-bold text-red-500 mb-4">
              Sản phẩm tương tự
            </h1>
            <div className="grid grid-cols-5 gap-4 items-center">
              {Listproduct.slice(0, 5).map((item, index) => (
                <BasicProduct key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Phần thông tin sản phẩm */}
            <div className="col-span-2 bg-white shadow-lg rounded-lg p-6" style={{ height: "max-content" }}>
              <h1 className="text-2xl font-bold mb-4">

              </h1>
              <p className="text-red-500 font-bold text-lg mb-4">

              </p>
              <p className="text-gray-700 mb-4">

              </p>
              <img
                src="#"
                alt="Ảnh sản phẩm"
                className="w-full rounded-lg mb-4"
              />
              <button className="text-center text-red-500 font-bold">Xem thêm</button>
            </div>

            {/* Phần thông số kỹ thuật */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-500 mb-4">Thông số kỹ thuật</h2>
              <div className="space-y-6">
                {specificationsoriginal.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-bold mb-2 ">{section.category}</h3>
                    <div className="space-y-2">
                      {section.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between border-b pb-2"
                        >
                          <span className="font-semibold">{detail.label}</span>
                          <span className="text-gray-700">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {isExpanded && (
                <div className="space-y-6 mt-6">
                  {specifications.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-bold mb-2 text-red-500">{section.category}</h3>
                      <div className="space-y-2">
                        {section.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between border-b pb-2"
                          >
                            <span className="font-semibold">{detail.label}</span>
                            <span className="text-gray-700">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={toggleExpand}
                className="text-red-500 font-bold mt-4 flex justify-center w-full"
              >
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            </div>

          </div>
        </div>


      </div>
    </div>

  );
};

export default ProductPage;
