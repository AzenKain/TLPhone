"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import "@/css/styles.css";
import "@/app/cart/page"
import {signOut, useSession} from "next-auth/react";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import { UpdateUser } from "@/app/redux/features/user/user.redux";
import { getUserByIdApi, makeRequestApi } from "@/lib/api";
import { UserType } from "@/types";
import { useRouter } from "next/navigation";

export default function Header() {
    const { data: session } = useSession()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const userDetail = useAppSelector((state) => state.UserRedux.value)
    useEffect(() => {
        const fetchData = async () => {
            let dataUser: UserType = await makeRequestApi(getUserByIdApi, session?.userId, session?.refresh_token, session?.access_token)
            if (dataUser) {
                dispatch(UpdateUser(dataUser))
            }
            else  {
                dispatch(UpdateUser(null))
            }

        }
        if (session?.userId && session?.refresh_token && session?.access_token) {
            fetchData();
        }
    }, [dispatch, session])

    const onSignOut = async () => {
        await signOut();
        router.push('/auth/signin')
    }

    return (
        <div className="navbar bg-base-100 header px-28">
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
                    <div className="hidden md:block mx-2">
                        <Link href="/" className="btn btn-ghost">
                            <Image src="/img/logo.png" alt="TLPhone Logo" width={90} height={90} />
                        </Link>
                    </div>
                </div>
                <div className="flex-none ">
                    <Link href="/search" className="btn btn-ghost btn-circle">
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
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </Link>
                </div>
            </div>
            <div className='hidden md:block'>
                <div className='row gap-10 flex flex-row'>
                    {/* <div className="flex flex-row gap-1 ">
                        <Image src="/img/find.png" alt="" width={30} height={30} />
                        <Link href={""} className="text-white" style={{ fontSize: 12 }}>Tra cứu<br /> đơn hàng</Link>
                    </div> */}
                    <div className="me-10 gap-1 flex flex-row justify-between">
                        <Image src="/img/phone.png" alt="" width={30} height={30}/>
                        <Link href={""} className="text-white" style={{fontSize: 12}}>Đặt hàng<br/> 886-9999</Link>
                    </div>
                </div>
            </div>
            {session != null && (
                <Link href={"/user/heart"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                         className="w-6 h-6 me-5 text-white">
                        <path
                            d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"/>
                    </svg>
                </Link>
            )}

            {session != null && (
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
                                <span className="badge badge-sm indicator-item">{userDetail.cart.cartProducts.reduce((sum, it) => sum + it.quantity, 0)}</span>
                            </div>
                        </div>

                        <div
                            tabIndex={0}
                            className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
                            <div className="card-body">
                                <span className="text-lg font-bold">{userDetail.cart.cartProducts.reduce((sum, it) => sum + it.quantity, 0)} Items</span>
                                <span className="text-info">
                                    Subtotal: {userDetail.cart.cartProducts.reduce((sum, it) => sum + it.quantity * it.productVariant.displayPrice, 0).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                                </span>
                                <div className="card-actions">
                                    <Link href={"/cart"} className="btn btn-block btn-cart text-white">View cart</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="dropdown dropdown-end me-6">
                {session == null ? (
                    <Link className="" href="/auth/signin">
                        <button className="btn btn-active bg-[#F6DED6] rounded-full">SignIn</button>
                    </Link>) :
                    (
                        <>
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="ounded-full flex justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="size-10 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    </svg>

                                </div>
                            </div>
                            <ul tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 p-2 shadow">
                                <li>
                                    <Link href={"/user/setting"} className="justify-between">Profile</Link>
                                </li>
                                <li>
                                    <Link href={"/user/order"}>Order management</Link>
                                </li>
                                <li>
                                    <Link href={"/user/reset-password"}>Reset Password</Link>
                                </li>
                                <li>
                                    <div onClick={async () => await onSignOut()}>Logout</div>
                                </li>
                            </ul>
                        </>
                    )}
            </div>
        </div>
    );
}