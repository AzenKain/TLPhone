export default function Slider() {
    return (
        <div>
            <div className="bg-red-900 p-4">
                {/* Header */}
                <div className="flex justify-between items-center gap-4 text-white text-sm">
                    <button className="bg-red-700 px-4 py-2 rounded-md">
                        DEAL SỐC HÔM NAY
                    </button>
                    <button className="bg-red-700 px-4 py-2 rounded-md">
                        ONLY ONLINE GIẢM ĐẾN 40%
                    </button>
                    <button className="bg-red-700 px-4 py-2 rounded-md">
                        SINH NHẬT CỬA HÀNG GIẢM ĐẾN 50%
                    </button>
                </div>
                {/* Products */}
                <div className="grid grid-cols-5 gap-4 mt-6">
                    {/* Product Card */}
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <div className="relative">
                            <img
                                src="https://via.placeholder.com/150"
                                alt="Product Image"
                                className="w-full h-auto rounded-md"
                            />
                            <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                ✨
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold">
                                Samsung Galaxy S24 Ultra 5G 256GB Chính Hãng (BHDT)
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-red-500 font-bold text-lg">24.690.000 đ</span>
                                <span className="text-gray-400 line-through text-sm">
                                    33.090.000 đ
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Giá ưu đãi:{" "}
                                <span className="text-black font-medium">24.390.000đ</span>
                            </p>
                        </div>
                    </div>
                    {/* Repeat Product Card for other products */}
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <div className="relative">
                            <img
                                src="https://via.placeholder.com/150"
                                alt="Product Image"
                                className="w-full h-auto rounded-md"
                            />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold">Xiaomi 14T 5G 512GB Chính Hãng</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-red-500 font-bold text-lg">12.390.000 đ</span>
                                <span className="text-gray-400 line-through text-sm">
                                    13.990.000 đ
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Tặng bộ sạc Xiaomi 67W</p>
                        </div>
                    </div>
                    {/* Add other product cards similarly */}
                </div>
            </div>

        </div>

    );
}