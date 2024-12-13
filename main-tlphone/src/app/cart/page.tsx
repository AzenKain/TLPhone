"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {useSession} from "next-auth/react";
import {Backend_URL} from "@/lib/Constants";
import {CartItemType, CartType, UserType} from "@/types";
import {CartItemInp, UpdateCartDto} from "@/lib/dtos/user";
import {getUserByIdApi, makeRequestApi, updateCartApi} from "@/lib/api";
import {UpdateUser} from "@/app/redux/features/user/user.redux";
import {toast} from "react-toastify";
import {UpdateShippingMethod} from "@/app/redux/features/cart/cart.redux";
import {useRouter} from "next/navigation";

export default function Cart() {
    const userDetail = useAppSelector((state) => state.UserRedux.value)
    const shippingMethod = useAppSelector((state) => state.CartRedux.shippingMethod)
    const shippingFee = useAppSelector((state) => state.CartRedux.shippingFee)
    const { data: session } = useSession()
    const dispatch = useAppDispatch()
    const router = useRouter()
    useEffect(() => {
        const fetchData = async () => {
            let dataUser: UserType = await makeRequestApi(getUserByIdApi, session?.userId, session?.refresh_token, session?.access_token)
            dispatch(UpdateUser(dataUser));
        }
        if (session?.userId && session?.refresh_token && session?.access_token) {
            fetchData();
        }
    }, [dispatch, session])
    const handleCheckout = async () => {
        if (!userDetail.cart.cartProducts || userDetail.cart.cartProducts.length === 0) {
            return
        }
        router.push("/cart/checkout")
    }
    const handleIncrease = async (it : CartItemType) => {
        if (!it.productVariant.stockQuantity) {
            return
        }

        if (it.quantity >= it.productVariant.stockQuantity) {
            return;
        }

        const dto: UpdateCartDto = {
            cartProducts: userDetail.cart.cartProducts.map(x => ({
                quantity: x.quantity,
                productId: Number(x.product.id),
                productVariantId: Number(x.productVariant.id)
            }))
        };

        const newIt = dto.cartProducts.findIndex(x => x.productId === Number(it.product.id)
            && x.productVariantId === Number(it.productVariant.id)
        )
        if (newIt !== -1) {
            dto.cartProducts[newIt].quantity += 1
        }

        let dataCard: CartType = await makeRequestApi(updateCartApi, dto, session?.refresh_token, session?.access_token)

        if (dataCard) {
            dispatch(UpdateUser({...userDetail, cart: dataCard}))
            toast.success("Update cart successful!!");
        }
        else {
            toast.error("Update cart failed!!");
        }
    };

    const handleDecrease = async (it : CartItemType) => {
        if (it.quantity <= 1) {
            return;
        }

        const dto: UpdateCartDto = {
            cartProducts: userDetail.cart.cartProducts.map(x => ({
                quantity: x.quantity,
                productId: Number(x.product.id),
                productVariantId: Number(x.productVariant.id)
            }))
        };

        const newIt = dto.cartProducts.findIndex(x => x.productId === Number(it.product.id)
            && x.productVariantId === Number(it.productVariant.id)
        )
        if (newIt !== -1) {
            dto.cartProducts[newIt].quantity -= 1
        }

        let dataCard: CartType = await makeRequestApi(updateCartApi, dto, session?.refresh_token, session?.access_token)

        if (dataCard) {
            dispatch(UpdateUser({...userDetail, cart: dataCard}))
            toast.success("Update cart successful!!");
        }
        else {
            toast.error("Update cart failed!!");
        }
    }

    const handleRemove = async (it : CartItemType) => {
        const dto: UpdateCartDto = {
            cartProducts: userDetail.cart.cartProducts
                .filter(x => x.id !== it.id)
                .map(x => ({
                    quantity: x.quantity,
                    productId: Number(x.product.id),
                    productVariantId: Number(x.productVariant.id)
                }))
        };

        let dataCart: CartType = await makeRequestApi(updateCartApi, dto, session?.refresh_token, session?.access_token)

        if (dataCart) {
            dispatch(UpdateUser({...userDetail, cart: dataCart}))
            toast.success("Update cart successful!!");
        }
        else {
            toast.error("Update cart failed!!");
        }
    }



    return (
        <div className='grid grid-cols-1 lg:grid-cols-7 gap-5 mx-32 my-8'>
            <div className='lg:col-span-5' style={{ height: 'max-content' }}>
                {userDetail.cart.cartProducts.map(it => {
                    return (
                        <div key={it.id} className=' bg-white p-2 py-10 rounded-lg'>
                            <div className='grid grid-cols-1 md:grid-cols-7'>
                                <div className='md:col-span-2'>
                                    <Image
                                        src={
                                            (() => {
                                                const colorValue = it?.productVariant?.attributes?.find(
                                                    x => x?.type?.toLowerCase() === "color"
                                                )?.value;

                                                const url = it?.product?.details?.imgDisplay?.find(i =>
                                                    i?.link?.find(e => e.toLowerCase() === colorValue?.toLowerCase())
                                                )?.url;

                                                return url ? `${Backend_URL}${url}` : "/no-item-found.png";
                                            })()
                                        }
                                       alt='//'
                                       height={200}
                                       width={200}>

                                    </Image>
                                </div>
                                <div className='md:col-span-5'>
                                    <div className='grid grid-cols-1 md:grid-cols-7'>
                                        <div className='col-span-5'>
                                            <h1 className='text-xl'>{it.product.name}</h1>
                                            <div className='mt-6 grid gap-2'>
                                                {it.productVariant?.attributes && it.productVariant?.attributes.map(e => {
                                                    return (
                                                        <p key={e.id}><span className='text-slate-500'>{e.type}: </span>{e.value}</p>
                                                    )
                                                })}
                                            </div>

                                        </div>
                                        <div className='md:col-span-2 mt-2 justify-center'>
                                            <div className=''>
                                                <div className="flex items-center space-x-3 border rounded-md ms-1"
                                                     style={{width: "max-content"}}>
                                                    <button
                                                        onClick={async () => await handleDecrease(it)}
                                                        className="bg-stone-100 px-3 rounded-s-md hover:bg-slate-200 border-e">
                                                        -
                                                    </button>
                                                    <span className="text-md">{it.quantity}</span>
                                                    <button
                                                        onClick={async () => await handleIncrease(it)}
                                                        className="bg-stone-100 px-3 rounded-e-md hover:bg-slate-200 border-s">
                                                        +
                                                    </button>
                                                </div>
                                                <div className="mt-6">
                                                    <p className="gach-ngang ">
                                                        {it.productVariant.displayPrice
                                                            ? it.productVariant.displayPrice.toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })
                                                            : 'N/A'}</p>
                                                    <p className="text-red-700 text-lg">
                                                        {it.productVariant.displayPrice
                                                            ? (it.productVariant.displayPrice * (100 - 0) / 100).toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })
                                                            : 'N/A'}</p>
                                                </div>
                                                <div className="mt-4">
                                                    <div
                                                        className="btn btn-warning"
                                                        onClick={async() => await handleRemove((it))}
                                                    >
                                                        Remove
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                             className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                        </svg>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
            <div className='lg:col-span-2 bg-white rounded-lg w-full'>
                <div className='p-5'>
                    <div>
                        <h1 className='text-xl font-semibold border-b pb-3'>Order Summary</h1>
                    </div>
                    <div>
                        <h1 className='text-lg font-semibold pt-10 pb-3'>Shipping</h1>
                        <select
                            value={shippingMethod}
                            onChange={e => dispatch(UpdateShippingMethod(e.target.value))}
                            className="select select-info w-full max-w-xs"
                        >
                            <option disabled>Select method</option>
                            <option value={"standard"}>Standard shipping - 25.000đ</option>
                            <option value={"fast"}>Express delivery - 75.000đ</option>
                        </select>
                    </div>
                    <div className='mt-3 divide-y divide-slate-300'>
                        <div className='py-3 flex justify-between'>
                            <p>Subtotal</p>
                            <p>{userDetail.cart.cartProducts.reduce((sum, it) => sum + it.quantity * it.productVariant.displayPrice, 0).toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            })}</p>
                        </div>
                        <div className='py-3 flex justify-between'>
                            <p>Shipping</p>
                            <p>
                                {shippingFee[shippingMethod].toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </p>
                        </div>
                        <div className='py-3 flex justify-between'>
                            <p>Tax</p>
                            <p>10%</p>
                        </div>
                        <div className='py-3 flex justify-between'>
                            <p>Total</p>
                            <p>
                                {
                                    (userDetail.cart.cartProducts.reduce((sum, it) => sum + it.quantity * it.productVariant.displayPrice, 0)
                                        * 1.1
                                        + shippingFee[shippingMethod]
                                    ).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })
                                }
                            </p>
                        </div>
                    </div>
                    <div className='justify-center flex w-full'>
                        <Link href={"/cart/checkout"} className="w-full">
                            <button onClick={handleCheckout} type="submit" className="btn bg-rose-600 text-white w-full mt-5 text-nowrap">Check
                                out
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )


}