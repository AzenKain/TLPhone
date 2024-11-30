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
                <div className='m-8 bg-white rounded-md'>
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