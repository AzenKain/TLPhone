"use client"
import React, { useEffect } from 'react';
import Image from "next/image";
import { useSearchParams, useRouter } from 'next/navigation'
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {OrderType, } from "@/types";
import {getOrderApi,} from "@/lib/api";
import {GetOrderDto} from "@/lib/dtos/order";
import {UpdateDisplayOrder} from "@/app/redux/features/order/order.redux";
import {Backend_URL} from "@/lib/Constants";

export default function Page({params,}: { params: { orderId: string }; }) {
    const searchParams = useSearchParams()
    const route = useRouter()
    const orderData = useAppSelector((state) => state.OrderRedux.displayOrder);
    const dispatch = useAppDispatch()
    
    useEffect(() => {
        const auth = searchParams.get('auth')
        if (!auth) {
            route.back()
        }
    }, [route, searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            const auth = searchParams.get('auth')
            if (!auth) {
                return
            }
            const dto : GetOrderDto = {
                orderId: params.orderId,
                authId: auth
            }
            const dataOrder: OrderType = await getOrderApi(dto, null)
            console.log(dataOrder)
            dispatch(UpdateDisplayOrder(dataOrder));
        }
        fetchData()
    }, [dispatch, params.orderId, searchParams])


    return (
        <div className="my-10">
            {orderData ? (
                <div className="w-full h-full">
                    <div className='text-center mb-10 grid gap-4'>
                        <h1 className='text-4xl font-bold'>Your Order</h1>
                        <p className='text-gray-400'>Thanks for making a purchare you can check our order summary from
                            below</p>
                    </div>
                    <div>
                        <div className='mx-8 my-3 bg-white rounded-md h-full py-4'>
                            <div
                                className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200 "
                            >
                                <div className="data">
                                    <p className="font-semibold text-base leading-7 text-black">Order Id: <span
                                        className="text-indigo-600 font-medium">{orderData.orderUid}</span></p>
                                    <p className="font-semibold text-base leading-7 text-black mt-4">Order Payment : <span
                                        className="text-gray-400 font-medium">{new Date(orderData?.created_at ?? "").toUTCString()}</span>
                                    </p>
                                </div>

                                <div className="text-center text-3xl font-bold border-4 bg-gray-300 px-4 py-2 rounded-full">
                                    {orderData.paymentInfo.isPaid ? "Paid" : "UnPaid"}

                                </div>
                            </div>
                            {orderData.orderProducts.map(e => {
                                return (
                                    <div key={e.id} className='border-b p-8 gap-2 grid grid-cols-8 lg:grid-cols-12'>
                                        <div className='col-span-2 lg:col-span-2'>
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
                                        <div className='col-span-6 lg:col-span-5' style={{width: 'max-content', height: 'max-content'}}>
                                            <h1 className='text-xl font-bold'>{e.product.name}</h1>
                                            <div className='mt-10 grid gap-1'>
                                                {e.variantAttributes && e.variantAttributes.map(e => {
                                                    return (
                                                        <p key={e.id}>
                                                            <span className='text-slate-500'>{e.type}: </span>{e.value}
                                                        </p>
                                                    )
                                                })}
                                            </div>

                                        </div>
                                        <div className='col-span-4 lg:col-span-2 flex gap-6'>
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
                                                >{orderData.status}</p>
                                            </div>
                                        </div>
                                        <div className='col-span-4 lg:col-span-3 ms-24'>
                                            <div>
                                                <p>Expected Delivery Time</p>
                                                <p className='text-green-500 mt-6'>
                                                    {new Date(new Date(orderData?.created_at ?? "").setDate(new Date(orderData?.created_at ?? "").getDate() + 7)).toDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className='p-8 grid grid-cols-2 lg:grid-cols-4'>
                                <p className='font-semibold'>Payment method: <span
                                    className='text-slate-400'>{orderData.paymentInfo.paymentType}</span>
                                </p>
                                <p className='font-semibold'>
                                    Shipping Type:
                                    <span className='text-blue-500'>
                                         {orderData.deliveryInfo.deliveryType}
                                    </span>
                                </p>
                                <p className='font-semibold'>
                                    Shipping:
                                    <span className='text-blue-500'>
                                        {orderData.deliveryInfo.deliveryFee.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </span>
                                </p>

                                <p className='font-semibold'>Total price:
                                    <span className='text-blue-500'>
                                    {orderData.totalAmount.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </span><span className='text-red-500'>(+10% tax)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center text-7xl justify-center h-72 w-screen bg-gray-100">
                    Loading
                    <span className="loading loading-infinity w-40"></span>
                </div>
            )}
        </div>
    );
}