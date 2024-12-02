<div className="mx-24">
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