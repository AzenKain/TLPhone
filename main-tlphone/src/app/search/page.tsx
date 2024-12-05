"use client"
import React, { useState } from 'react';
import { Search } from '@/types/search';
import BasicSearch from '@/components/Search/BasicSearch';
export default function ProductSearch() {
    const ListSearch: Search[] =
        [
            { id: 1, name: 'iPhone 16 Pro Max', discount: 4, price: 34990000, imgdisplay: 'https://cdn-v2.didongviet.vn/files/products/2024/9/2/1/1727855468669_thumb_iphone_16_pro_didongviet.jpg' },
            { id: 2, name: 'iPhone 15 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 3, name: 'iPhone 13 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 4, name: 'iPhone 12 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 5, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 6, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 7, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 8, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 9, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 10, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 11, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 12, name: 'iPhone 16 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://cdn-v2.didongviet.vn/files/products/2024/9/2/1/1727855468669_thumb_iphone_16_pro_didongviet.jpg' },
            { id: 13, name: 'iPhone 13 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 14, name: 'iPhone 12 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 15, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 16, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 17, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 18, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 19, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 20, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 1, name: 'iPhone 16 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://cdn-v2.didongviet.vn/files/products/2024/9/2/1/1727855468669_thumb_iphone_16_pro_didongviet.jpg' },
            { id: 2, name: 'iPhone 15 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 3, name: 'iPhone 13 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 4, name: 'iPhone 12 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 5, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 6, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 7, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 8, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 9, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 10, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 11, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 12, name: 'iPhone 16 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://cdn-v2.didongviet.vn/files/products/2024/9/2/1/1727855468669_thumb_iphone_16_pro_didongviet.jpg' },
            { id: 13, name: 'iPhone 13 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 14, name: 'iPhone 12 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 15, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 16, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 17, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 18, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 19, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
            { id: 20, name: 'iPhone 11 Pro Max', discount: 10, price: 29990000, imgdisplay: 'https://didongviet.vn/_next/image?url=https%3A%2F%2Fcdn-v2.didongviet.vn%2Ffiles%2Fbanners%2F2024%2F10%2F13%2F1%2F1731470153334_untitled_1_824x400.png&w=1080&q=75' },
        ]
    const productsPerPage = 10;
    const totalPages = Math.ceil(ListSearch.length / productsPerPage);

    const [currentPage, setCurrentPage] = useState(1);

    const displayedProducts = ListSearch.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0);
        }
    };
    return (
        <div className="container mx-24 p-4">
            <div className="w-full gap-8">
                <div className="relative w-full h-full shadow-lg p-6 border rounded-lg bg-white">
                    <h1 className="text-xl font-bold text-red-500 mb-4">
                        Điện Thoại Apple iPhone Chính Hãng VN/A Mới Nhất
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {displayedProducts.map((item) => (
                            <BasicSearch key={item.id} item={item} />
                        ))}
                    </div>
                    <div className="flex justify-center items-center space-x-2 mt-6">

                        {currentPage > 1 && (
                            <>
                                <button
                                    className="px-3 py-1 border rounded hover:bg-gray-200"
                                    onClick={() => handlePageChange(1)}
                                >
                                    «
                                </button>
                                <button
                                    className="px-3 py-1 border rounded hover:bg-gray-200"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    ‹
                                </button>
                            </>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {

                            if (page === 1 && currentPage <= 3) {
                                return (
                                    <button
                                        key={page}
                                        className={`px-3 py-1 border rounded ${currentPage === page
                                            ? "bg-red-500 text-white"
                                            : "hover:bg-gray-200"
                                            }`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                );
                            }

                            if (page === totalPages && currentPage >= totalPages - 2) {
                                return (
                                    <button
                                        key={page}
                                        className={`px-3 py-1 border rounded ${currentPage === page
                                            ? "bg-red-500 text-white"
                                            : "hover:bg-gray-200"
                                            }`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                );
                            }

                            if (Math.abs(page - currentPage) <= 1) {
                                return (
                                    <button
                                        key={page}
                                        className={`px-3 py-1 border rounded ${currentPage === page
                                            ? "bg-red-500 text-white"
                                            : "hover:bg-gray-200"
                                            }`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                );
                            }

                            if (
                                (page === currentPage - 2 && page > 1) ||
                                (page === currentPage + 2 && page < totalPages)
                            ) {
                                return (
                                    <span key={page} className="px-3 py-1 border rounded hover:bg-gray-200">
                                        ..
                                    </span>
                                );
                            }

                            return null;
                        })}

                        {currentPage < totalPages && (
                            <>
                                <button
                                    className="px-3 py-1 border rounded hover:bg-gray-200"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    ›
                                </button>
                                <button
                                    className="px-3 py-1 border rounded hover:bg-gray-200"
                                    onClick={() => handlePageChange(totalPages)}
                                >
                                    »
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

};       
