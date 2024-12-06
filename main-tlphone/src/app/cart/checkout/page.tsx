"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
export default function Checkout() {
    return (
        <div className='mx-60 my-16'>
            <div className='shadow rounded-lg bg-white'>
                <div className='p-10'>
                    <p className='text-2xl text-center font-bold'>Checkout</p>
                    <div className=' bg-white p-2 py-10 rounded-lg'>
                        <div className='grid grid-cols-7 border-2 p-2 rounded-lg'>
                            <div className='col-span-2'>
                                <Image src={"/img/ip15.webp"} alt='//' height={200} width={200}></Image>
                            </div>
                            <div className='col-span-5'>
                                <div>
                                    <div style={{ width: 'max-content', height: 'max-content' }}>
                                        <h1 className='text-xl'>IPhone 16 Pro Max Chính Hãng (VN/A)</h1>
                                        <div className='flex justify-between'>
                                            <div className='mt-10 grid gap-2'>
                                                <p><span className='text-slate-500'>Ram: </span>16GB</p>
                                                <p><span className='text-slate-500'>Rom: </span>256GB</p>
                                                <p><span className='text-slate-500'>Màu sắc: </span>Titan</p>
                                            </div>
                                            <div className='ms-80 mt-20'>
                                                <div>
                                                    <p className="gach-ngang ">34.990.000 đ</p>
                                                    <p className="mt-2">34.290.000 đ</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-3 mt-8'>
                        <div className='col-span-1 grid'>
                            <div>
                                <p className='font-bold'>01<br />Personal Details</p>
                            </div>
                            <div className='mt-24'>
                                <p className='font-bold'>02<br />Shopping Address</p>
                            </div>
                            <div className='mt-28'>
                                <p className='font-bold'>03<br />Payment Method</p>
                            </div>
                            <div className='mt-24'>
                                <p className='font-bold'>04<br />Note</p>
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='col-span-1'>
                                        <input type="text" placeholder="Firstname" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className='col-span-1'>
                                        <input type="text" placeholder="Lastname" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4 mt-2'>
                                    <div className='col-span-1'>
                                        <input type="text" placeholder="Email" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className='col-span-1'>
                                        <input type="text" placeholder="Phone" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                </div>
                            </div>
                            <div className='mt-10'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='col-span-1'>
                                        <input type="text" placeholder="District" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                    <div className='col-span-1'>
                                        <input type="text" placeholder="Address" className="input input-bordered w-full max-w-xs" />
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <div className=''>
                                        <input type="text" placeholder="AddressDetails" className="input input-bordered w-full" />
                                    </div>
                                </div>
                            </div>
                            <div className='mt-10 flex gap-52'>
                                <div className='flex gap-4'>
                                    <div className="form-control mt-5">
                                        <label className="label cursor-pointer">
                                            <input type="radio" name="radio-10" className="radio checked:bg-red-500" defaultChecked />
                                        </label>
                                    </div>
                                    <Image src="/img/vnpay.png" alt='' height={70} width={90} style={{ height: "80px" }} />
                                </div>
                                <div className='flex gap-4'>
                                    <div className="form-control mt-5">
                                        <label className="label cursor-pointer">
                                            <input type="radio" name="radio-10" className="radio checked:bg-red-500" defaultChecked />
                                        </label>
                                    </div>
                                    <Image src="/img/cod.png" alt='' height={50} width={90} style={{ height: "80px" }}></Image>
                                </div>
                            </div>
                            <div>
                                <div className='mt-20'>
                                    <input type="text" placeholder="Note" className="input input-bordered w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div className='flex gap-2 mt-20'>
                            <button className='border rounded max-w-fit py-2 px-3'>
                                <p>Pay later</p>
                            </button>
                            <Link href={"/thankiu"}>
                                <button className='border rounded max-w-fit py-2 px-3 bg-blue-500 text-white'>
                                    <p>Pay now</p>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}