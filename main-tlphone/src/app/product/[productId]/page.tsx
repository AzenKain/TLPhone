import React, { useState } from "react";

const ProductPage = () => {
  const images = [
    "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75",
    "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731430895942_main_3.png&w=1080&q=75",
    "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731463978930_ip16_pro_max.png&w=1080&q=75",
    "https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731485578770_pova_6_824x400_copy.png&w=1080&q=75",
  ];

  const [currentSlide, setCurrentSlide] = useState(0); 
  const [selectedOption, setSelectedOption] = useState("256GB");

  
  const goToSlide = (index) => {
    if (index < 0) index = images.length - 1; 
    if (index >= images.length) index = 0; 
    setCurrentSlide(index); 
  };

  return (
    <div className="container mx-auto p-4">
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
                  className={`px-3 py-2 border rounded-lg ${
                    selectedOption === option
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
              {["Xanh", "Vàng", "Đen", "Trắng","Titan"].map((option) => (
                <button
                  key={option}
                  className={`px-3 py-2 border rounded-lg ${
                    selectedOption === option
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
                  className={`px-3 py-2 border rounded-lg ${
                    selectedOption === option
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
    </div>
  );
};

export default ProductPage;