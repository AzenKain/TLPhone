"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
export default function Order() {
    const [selected, setSelected] = useState<number | null>(null);

    const handleClick = (value: any, index: number) => {
        console.log(`Button value: ${value}`);
        setSelected(index);
    };
    const words = ['All single', 'Processing', 'In transit', 'Delivered', 'Cancelled'];

    return (
        <div className='flex flex-col'>
            <form className="my-4 mx-16">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter search name" required />
                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>

            <div className='flex justify-around w-full border-b py-5 bg-white shadow'>
                {["All single", 'Processing', 'In transit', 'Delivered', 'Cancelled'].map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(item, index)}
                        className={`px-4 py-2 mb-2 ${selected === index ? 'border-b border-red-300' : ''}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
            {selected !== null && (
                <div className='mx-8 my-3 bg-white rounded-md'>
                    <div className='border-b p-8 gap-2 grid'>
                        <p className='font-semibold'>Order Id: <span className='text-blue-500'>111111111111111111</span></p>
                        <p className='font-semibold'>Order Payment: <span className='text-slate-300'>Wed, 29 Nov 2024</span></p>
                    </div>
                    <div className='border-b p-8 gap-2 grid grid-cols-12'>
                        <div className='col-span-2'>
                            <Image src="/img/ip15.webp" alt="" width={150} height={150} />
                        </div>
                        <div className='col-span-5' style={{ width: 'max-content', height: 'max-content' }}>
                            <h1 className='text-xl font-bold'>IPhone 15 Pro Max Chính Hãng (VN/A)</h1>
                            <div className='mt-10 grid gap-1'>
                                <p><span className='text-slate-500'>Ram: </span>16GB</p>
                                <p><span className='text-slate-500'>Rom: </span>256GB</p>
                                <p><span className='text-slate-500'>Màu sắc: </span>Titan</p>
                            </div>

                        </div>
                        <div className='col-span-2 flex gap-6'>
                            <div>
                                <p>Price</p>
                                <p className='text-indigo-500 mt-6'>22222222đ</p>
                            </div>
                            <div>
                                <p>Status</p>
                                <p className='text-green-500 bg-slate-100 rounded-full mt-5 py-1 px-2' style={{ width: "max-content" }}>Processing</p>
                            </div>
                        </div>
                        <div className='col-span-3 ms-24'>
                            <div>
                                <p>Expected Delivery Time</p>
                                <p className='text-green-500 mt-6' style={{ width: "max-content" }}>Wed Nov 29 2024</p>
                            </div>
                        </div>
                    </div>
                    <div className='p-8 flex justify-between'>
                        <p className='font-semibold'>Payment method: <span className='text-slate-400'>VNPAY</span></p>
                        <p className='font-semibold'>Shipping: <span className='text-blue-500'>25.000d</span></p>
                        <p className='font-semibold'>Total price: <span className='text-blue-500'>22.247.222đ</span><span className='text-red-500'>(+10% tax)</span></p>
                    </div>
                </div>
            )}
        </div>
    );
}