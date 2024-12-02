"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";

export default function Cart() {
    const [quantity, setQuantity] = useState(1);
    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }
    if (quantity === 0) {
        return null;
    }
    return (
        <div className='grid grid-cols-7 gap-5'>
            <div className='col-span-5 bg-white p-2 py-10 rounded-lg' style={{height: 'max-content' }}>
                <div className='grid grid-cols-7'>
                    <div className='col-span-2'>
                        <Image src={"/img/ip15.webp"} alt='//' height={200} width={200}></Image>
                    </div>
                    <div className='col-span-5'>
                        <div className='grid grid-cols-7'>
                            <div className='col-span-5' style={{ width: 'max-content', height: 'max-content' }}>
                                <h1 className='text-xl'>IPhone 16 Pro Max Chính Hãng (VN/A)</h1>
                                <div className='mt-10 grid gap-2'>
                                    <p><span className='text-slate-500'>Ram: </span>16GB</p>
                                    <p><span className='text-slate-500'>Rom: </span>256GB</p>
                                    <p><span className='text-slate-500'>Màu sắc: </span>Titan</p>
                                </div>

                            </div>
                            <div className='col-span-2'>
                                <div className='ms-10'>
                                    <div className="flex items-center space-x-3 border rounded-md ms-1" style={{ width: "max-content" }}>
                                        <button
                                            onClick={handleDecrease}
                                            className="bg-gray-300 px-3 rounded-s-md hover:bg-slate-200 border-e">
                                            -
                                        </button>
                                        <span className="text-md">{quantity}</span>
                                        <button
                                            onClick={handleIncrease}
                                            className="bg-gray-300 px-3 rounded-e-md hover:bg-slate-200 border-s">
                                            +
                                        </button>
                                    </div>
                                    <div className="mt-10">
                                        <p className="gach-ngang ">34.990.000 đ</p>
                                        <p className="mt-2">34.290.000 đ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-2 bg-white rounded-lg'>
                <div className='p-5'>
                    <div>
                        <h1 className='text-xl font-semibold border-b pb-3'>Order Summary</h1>
                    </div>
                    <div>
                        <h1 className='text-lg font-semibold pt-10 pb-3'>Shipping</h1>
                        <select className="select select-info w-full max-w-xs">
                            <option disabled selected>Select method</option>
                            <option>Standard shipping - 25.000đ</option>
                            <option>Standard shipping - 25.000đ</option>
                            <option>Standard shipping - 25.000đ</option>
                        </select>
                    </div>
                    <div className='mt-3 divide-y divide-slate-300'>
                        <div className='py-3 flex justify-between'>
                            <p>Subtotal</p>
                            <p>34.290.000đ</p>
                        </div>
                        <div className='py-3 flex justify-between'>
                            <p>Shipping</p>
                            <p>25.000đ</p>
                        </div>
                        <div className='py-3 flex justify-between'>
                            <p>Tax</p>
                            <p>10%</p>
                        </div>
                        <div className='py-3 flex justify-between'>
                            <p>Total</p>
                            <p>37.990.000đ</p>
                        </div>
                    </div>
                    <div className='justify-center flex'>
                        <button type="submit" className="btn bg-rose-600 text-white px-29 mt-5 text-nowrap">Check out</button>
                    </div>
                </div>
            </div>
        </div >
    )


}