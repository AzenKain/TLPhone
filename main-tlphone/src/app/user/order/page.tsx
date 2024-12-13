"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import {OrderType, UserType} from "@/types";
import {generateVnpayPaymentApi, getOrderListByUserApi, getUserByIdApi, makeRequestApi} from "@/lib/api";
import {UpdateUser} from "@/app/redux/features/user/user.redux";
import {useSession} from "next-auth/react";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {AddFilterOrder, AddListOrder, FindById} from "@/app/redux/features/order/order.redux";
import {Backend_URL} from "@/lib/Constants";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {GenerateVnpayPaymentDto, GenerateVnpayPaymentResponse} from "@/lib/dtos/order";
import * as sea from "node:sea";
export default function Order() {
    const [selected, setSelected] = useState<number | null>(null);
    const { data: session } = useSession()
    const userDetail = useAppSelector((state) => state.UserRedux.value)
    const dispatch = useAppDispatch()
    const orderList = useAppSelector((state) => state.OrderRedux.value)
    const [filter, setFilter] = useState<string>("All singles")
    const [search, setSearch] = useState<string>("")
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            let dataOrder: OrderType[] = await makeRequestApi(getOrderListByUserApi, null, session?.refresh_token, session?.access_token)
            if (!dataOrder) return;
            dispatch(AddListOrder(dataOrder))
        }
        if (session?.userId && session?.refresh_token && session?.access_token) {
            fetchData();
        }
    }, [dispatch, session]);

    const handlePaynow = async (orderId: string) => {
        const dtoVnpay : GenerateVnpayPaymentDto =  {
            method: 'Vnpay',
            orderUid: orderId
        }
        let dataReturn2 : GenerateVnpayPaymentResponse = await makeRequestApi(generateVnpayPaymentApi, dtoVnpay, session?.refresh_token, session?.access_token)
        if (!dataReturn2) {
            toast.error("Create your Vnpay bill failed!")
            return;
        }
        router.push(`${dataReturn2.url}`)
        return;
    }

    useEffect(() => {
        dispatch(FindById(search))
        dispatch(AddFilterOrder(filter))
        dispatch(FindById(search))
    }, [dispatch, search, filter])

    const handleClick = (value: string, index: number) => {
        setFilter(value)
        setSelected(index);
    };
    const words = ['All single', 'Pending', 'Confirmed', 'Delivered', 'Completed', 'Cancelled', 'Refunded'];

    return (
        <div className='flex flex-col'>
            <form className="my-4 mx-16">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter search name"
                        required
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </form>

            <div className='flex justify-around w-full border-b py-5 bg-white shadow'>
                {words.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(item, index)}
                        className={`px-4 py-2 mb-2 ${selected === index ? 'border-b border-red-300' : ''}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
            {orderList.map(it => {
                return(
                    <div key={it.id} className='mx-8 my-3 bg-white rounded-md'>
                        <div
                            className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200 mt-4"
                        >
                            <div className="data">
                                <p className="font-semibold text-base leading-7 text-black">Order Id: <span
                                    className="text-indigo-600 font-medium">{it.orderUid}</span></p>
                                <p className="font-semibold text-base leading-7 text-black mt-4">Order Payment : <span
                                    className="text-gray-400 font-medium">{new Date(it?.created_at ?? "").toUTCString()}</span>
                                </p>
                            </div>
                            {it.paymentInfo.isPaid == false && it.status !== "Cancelled" && it.paymentInfo.paymentType == "VNPAY" && (
                                <div
                                    onClick={async () => await handlePaynow(it.orderUid ?? "")}
                                    className="cursor-pointer text-center text-3xl font-bold border-4 bg-green-300 px-4 py-2 rounded-full"
                                >
                                    Pay Now
                                </div>
                            )}

                            <div className="text-center text-3xl font-bold border-4 bg-gray-300 px-4 py-2 rounded-full">
                                {it.paymentInfo.isPaid ? "Paid" : "UnPaid"}

                            </div>
                        </div>
                        {it.orderProducts.map(e => {
                            return (
                                <div key={e.id} className='border-b p-8 gap-2 grid grid-cols-12'>
                                    <div className='col-span-2'>
                                        <Image src={
                                            (() => {
                                                if (!e?.variantAttributes) return "/no-item-found.png"
                                                const colorValue = e?.variantAttributes.find(
                                                    x => x?.type?.toLowerCase() === "color"
                                                )?.value;

                                                const url = e?.product?.details?.imgDisplay?.find(i =>
                                                    i?.link?.find(x => x.toLowerCase() === colorValue?.toLowerCase())
                                                )?.url;

                                                return url ? `${Backend_URL}${url}` : "/no-item-found.png";
                                            })()
                                        } alt="" width={150} height={150}/>
                                    </div>
                                    <div className='col-span-5' style={{width: 'max-content', height: 'max-content'}}>
                                        <h1 className='text-xl font-bold'>{e.product.name}</h1>
                                        <div className='mt-10 grid gap-1'>
                                            {e.productVariant?.attributes && e.productVariant?.attributes.map(e => {
                                                return (
                                                    <p key={e.id}><span className='text-slate-500'>{e.type}: </span>{e.value}</p>
                                                )
                                            })}
                                        </div>

                                    </div>
                                    <div className='col-span-2 flex gap-6'>
                                        <div>
                                            <p>Price</p>
                                            <p className='text-indigo-500 mt-6'>{e.unitPrice.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}</p>
                                        </div>
                                        <div>
                                            <p>Status</p>
                                            <p className='text-green-500 bg-slate-100 rounded-full mt-5 py-1 px-2'
                                              >{it.status}</p>
                                        </div>
                                    </div>
                                    <div className='col-span-3 ms-24'>
                                        <div>
                                            <p>Expected Delivery Time</p>
                                            <p className='text-green-500 mt-6'>
                                                {new Date(new Date(it?.created_at ?? "").setDate(new Date(it?.created_at ?? "").getDate() + 7)).toDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <div className='p-8 flex justify-between'>
                            <p className='font-semibold'>Payment method: <span
                                className='text-slate-400'>{it.paymentInfo.paymentType}</span></p>
                            <p className='font-semibold'>Shipping Type: <span className='text-blue-500'>
                                {it.deliveryInfo.deliveryType}
                            </span></p>
                            <p className='font-semibold'>Shipping: <span className='text-blue-500'>
                                {it.deliveryInfo.deliveryFee.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </span></p>

                            <p className='font-semibold'>Total price:
                                <span className='text-blue-500'>
                                    {it.totalAmount.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </span><span className='text-red-500'>(+10% tax)</span>
                            </p>
                        </div>
                    </div>
                )
            })}

        </div>
    );
}