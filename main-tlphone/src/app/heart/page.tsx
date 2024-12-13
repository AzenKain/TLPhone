"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
export default function Heart() {
    return (
        <div>
            <p className='text-3xl mt-10 ms-24 border-black border-b-2' style={{width:"max-content "}}>Products you like</p>
            <div className='rounded-lg my-5 mx-20'>
                <div className='grid grid-cols-6 rounded-lg bg-white p-2'>
                    <div className='p-3 border rounded-md shadow relative'>
                        <Image src="/img/ip15.webp" alt="" width={300} height={300} />
                        <div className='absolute top-2 right-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6  text-red-500">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>
                        <p className='font-bold text-center my-2 text-lg'>IPhone 15 Pro Max</p>
                        <div className='grid gap-1 ms-2'>
                            <p>Color: <span>Titan</span></p>
                            <p>Price: <span className='font-bold'>24.000.000</span>đ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}