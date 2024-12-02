"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import "@/css/styles.css";
import "@/app/cart/page"
export default function Header() {
    return (
        <div className="navbar bg-base-100 header">
            <div className='flex-1'>
                <div className="flex">
                    <div className="block md:hidden">
                        <div className="dropdown me-6">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <Image src="/img/menu.png" alt="" width={40} height={40} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 p-2 shadow">
                                <li>
                                    <Link href={""}>IPhone</Link>
                                </li>
                                <li>
                                    <Link href={""}>Samsung</Link>
                                </li>
                                <li>
                                    <Link href={""}>OPPO</Link>
                                </li>
                                <li>
                                    <Link href={""}>Xiaomi</Link>
                                </li>
                                <li>
                                    <Link href={""}>realme</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Link href="/" className="btn btn-ghost">
                            <Image src="/img/logo.png" alt="TLPhone Logo" width={90} height={90} />
                        </Link>
                    </div>
                </div>
                <div className="flex-none gap-2">
                    <div className="form-control flex flex-row">
                        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                        <button className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http:www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className='hidden md:block'>
                <div className='row gap-10 flex flex-row'>
                    {/* <div className="flex flex-row gap-1 ">
                        <Image src="/img/find.png" alt="" width={30} height={30} />
                        <Link href={""} className="text-white" style={{ fontSize: 12 }}>Tra cứu<br /> đơn hàng</Link>
                    </div> */}
                    <div className="me-10 gap-1 flex flex-row justify-between">
                        <Image src="/img/phone.png" alt="" width={30} height={30} />
                        <Link href={""} className="text-white" style={{ fontSize: 12 }}>Đặt hàng<br /> 886-9999</Link>
                    </div>
                </div>
            </div>
            <div className="flex-none me-4 mt-1">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg
                                xmlns="http:www.w3.org/2000/svg"
                                className="h-9 w-9 text-white "
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="badge badge-sm indicator-item">8</span>
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
                        <div className="card-body">
                            <span className="text-lg font-bold">8 Items</span>
                            <span className="text-info">Subtotal: $999</span>
                            <div className="card-actions">
                                <Link href={"/cart"} className="btn btn-block btn-cart text-white">View cart</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dropdown dropdown-end me-6">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <Image src="/img/accout.png" alt="" width={70} height={70} />
                    </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 p-2 shadow">
                    <li>
                        <Link href={"/order"} className="justify-between">Profile</Link>
                    </li>
                    <li>
                        <Link href={""}>Favorites</Link>
                    </li>
                    <li>
                        <Link href={""}>Logout</Link>
                    </li>
                </ul>
            </div>

        </div>
    );
}