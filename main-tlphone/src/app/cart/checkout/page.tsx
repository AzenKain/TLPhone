"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {OrderType, UserType} from "@/types";
import {createOrderApi, generateVnpayPaymentApi, getUserByIdApi, makeRequestApi} from "@/lib/api";
import {UpdateUser} from "@/app/redux/features/user/user.redux";
import {Backend_URL} from "@/lib/Constants";
import {CreateOrderDto, GenerateVnpayPaymentDto, GenerateVnpayPaymentResponse} from "@/lib/dtos/order";
import {toast} from "react-toastify";
import {fetchData} from "next-auth/client/_utils";
export default function Checkout() {
    const userDetail = useAppSelector((state) => state.UserRedux.value)
    const shippingMethod = useAppSelector((state) => state.CartRedux.shippingMethod)
    const shippingFee = useAppSelector((state) => state.CartRedux.shippingFee)
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [district, setDistrict] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [payment, setPayment] = useState<string>("VNPAY");
    const { data: session } = useSession()
    const dispatch = useAppDispatch()
    const router = useRouter()
    useEffect(() => {
        const fetchData = async () => {
            let dataUser: UserType = await makeRequestApi(getUserByIdApi, session?.userId, session?.refresh_token, session?.access_token)
            dispatch(UpdateUser(dataUser));
            setFirstName(dataUser.details.firstName ? dataUser.details.firstName : "")
            setLastName(dataUser.details.lastName ? dataUser.details.lastName : "")
            setAddress(dataUser.details.address ? dataUser.details.address : "")
            setPhoneNumber(dataUser.details.phoneNumber ? dataUser.details.phoneNumber : "")
        }
        if (session?.userId && session?.refresh_token && session?.access_token) {
            fetchData();
        }
        if (session == null) {
            router.back();
        }
    }, [dispatch, session])

    const handleShow = (check : boolean) => {
        const modal = document.getElementById('my_modal_5') as HTMLDialogElement | null;
        if (session == null) {
            toast.error("You must be logged in!")
            return;
        }
        if (!userDetail.email) {
            toast.error("You must enter your email!")
            return;
        }
        if (phoneNumber == "") {
            toast.error("You must enter your phone number!")
            return;
        }
        if (address == "") {
            toast.error("You must enter your address!")
            return;
        }
        if (lastName == "") {
            toast.error("You must enter your last name!")
            return;
        }
        if (!modal) {
            return
        }
        if (check) {
            modal.showModal();
        }
        else {
            modal.close()
        }
    }

    const handleSubmit = async () => {
        const dto: CreateOrderDto = {
            deliveryInfo : {
                city: city,
                district: district,
                address: address,
                deliveryType: shippingMethod
            },
            customerInfo: {
                email: userDetail.email,
                lastName: lastName,
                firstName: firstName,
                phoneNumber: phoneNumber
            },
            paymentType: payment,
        }
        let dataReturn : OrderType = await makeRequestApi(createOrderApi, dto, session?.refresh_token, session?.access_token)
        if (!dataReturn) {
            toast.error("Create your order failed!")
            return;
        }
        else {
            let dataUser: UserType = await makeRequestApi(getUserByIdApi, session?.userId, session?.refresh_token, session?.access_token)
            dispatch(UpdateUser(dataUser));
            toast.success("Create your order successful!")
        }


        if (payment == "VNPAY") {
            const dtoVnpay : GenerateVnpayPaymentDto =  {
                method: 'Vnpay',
                orderUid: dataReturn.orderUid
            }
            let dataReturn2 : GenerateVnpayPaymentResponse = await makeRequestApi(generateVnpayPaymentApi, dtoVnpay, session?.refresh_token, session?.access_token)
            if (!dataReturn2) {
                toast.error("Create your Vnpay bill failed!")
                return;
            }
            router.push(`${dataReturn2.url}`)
            return;
        }
        const params = new URLSearchParams();
        params.append('auth', userDetail.secretKey);
        router.push(`/order/${dataReturn.id}?${params.toString()}`)
    }
    return (
        <div className='mx-4 my-10 md:mx-8 md:my-10 lg:mx-60 lg:my-16'>
            <div className='shadow rounded-lg bg-white'>
                <div className='p-10'>
                    <p className='text-2xl text-center font-bold'>Checkout</p>
                    <div className=' bg-white p-2 py-10 rounded-lg'>
                        {userDetail.cart.cartProducts.map(it => {
                            return (
                                <div key={it.id} className=' bg-white p-2 py-10 rounded-lg'>
                                    <div className='grid grid-cols-2 md:grid-cols-7'>
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
                                                                <p key={e.id}><span
                                                                    className='text-slate-500'>{e.type}: </span>{e.value}
                                                                </p>
                                                            )
                                                        })}
                                                    </div>

                                                </div>
                                                <div className='md:col-span-2 mt-2 justify-center'>
                                                    <div className=''>
                                                        <div
                                                            className="flex items-center"
                                                        >
                                                            <div className="font-bold text-lg flex flex-row gap-2">
                                                                <span className="font-bold text-lg ">Số lượng:</span>
                                                                <span
                                                                    className="font-bold text-lg text-cyan-400">{`(${it.quantity})`}</span>
                                                            </div>

                                                        </div>
                                                        <div className="mt-6 ">
                                                            <p className="gach-ngang ">
                                                                {it.productVariant.displayPrice
                                                                    ? it.productVariant.displayPrice.toLocaleString('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    })
                                                                    : 'N/A'}</p>
                                                            <p className="mt-2 text-red-700 text-lg">
                                                                {it.productVariant.displayPrice
                                                                    ? (it.productVariant.displayPrice * (100 - 0) / 100).toLocaleString('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                    })
                                                                    : 'N/A'}</p>
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
                    <div className='grid grid-cols-3 mt-8'>
                        <div className='col-span-1 grid'>
                            <div>
                                <p className='font-bold'>01<br/>Personal Details</p>
                            </div>
                            <div className='mt-36 md:mt-24'>
                                <p className='font-bold'>02<br/>Shopping Address</p>
                            </div>
                            <div className='mt-36 md:mt-24'>
                                <p className='font-bold'>03<br/>Payment Method</p>
                            </div>
                            <div className='mt-24'>
                                <p className='font-bold'>04<br/>Note</p>
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='col-span-1'>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            placeholder="Firstname"
                                            className="input input-bordered w-full max-w-xs"
                                        />
                                    </div>
                                    <div className='col-span-1'>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            placeholder="Lastname"
                                            className="input input-bordered w-full max-w-xs"
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                                    <div className='col-span-1'>
                                        <input type="text" value={userDetail.email || ""} placeholder="Email" disabled
                                               className="input input-bordered w-full max-w-xs"/>
                                    </div>
                                    <div className='col-span-1'>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (/^[0-9]*$/.test(newValue)) {
                                                    setPhoneNumber(newValue);
                                                }
                                            }}
                                            placeholder="Phone"
                                            className="input input-bordered w-full max-w-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='mt-10'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='col-span-1'>
                                        <input
                                            value={district}
                                            onChange={e => setDistrict(e.target.value)}
                                            type="text"
                                            placeholder="District"
                                            className="input input-bordered w-full max-w-xs"
                                        />
                                    </div>
                                    <div className='col-span-1'>
                                        <input
                                            value={city}
                                            onChange={e => setCity(e.target.value)}
                                            type="text"
                                            placeholder="City"
                                            className="input input-bordered w-full max-w-xs"/>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <div className=''>
                                        <input
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            type="text"
                                            placeholder="AddressDetails"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='mt-10 '>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='col-span-1'>
                                        <div className='flex gap-4'>
                                            <div className="form-control mt-5">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="radio-10"
                                                        value="VNPAY"
                                                        className="radio checked:bg-red-500"
                                                        onChange={e => setPayment(e.target.value)}
                                                        checked={payment == "VNPAY"}
                                                        defaultChecked
                                                    />
                                                </label>
                                            </div>
                                            <Image src="/img/vnpay.png" alt='' height={70} width={90}
                                                   style={{height: "80px"}}/>
                                        </div>
                                    </div>
                                    <div className='col-span-1'>
                                        <div className='flex gap-4'>
                                            <div className="form-control mt-5">
                                                <label className="label cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="radio-10"
                                                        value="COD"
                                                        onChange={e => setPayment(e.target.value)}
                                                        className="radio checked:bg-red-500"
                                                        checked={payment == "COD"}
                                                    />
                                                </label>
                                            </div>
                                            <Image src="/img/cod.png" alt='' height={50} width={90}
                                                   style={{height: "80px"}}></Image>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='mt-20'>
                                    <input
                                        type="text"
                                        placeholder="Note"
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div className='flex gap-2 mt-20'>
                            <button
                                onClick={() => router.back()}
                                className='border rounded max-w-fit py-2 px-3'
                            >
                                <p>Pay later</p>
                            </button>
                            <div>
                                <button onClick={() => handleShow(true)}
                                        className='border rounded max-w-fit py-2 px-3 bg-blue-500 text-white'>
                                    <p>Pay now</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-rose-500">
                        Are you sure you want to create a order?
                    </h3>
                    <div className="modal-action">
                        <button
                            onClick={async () => handleSubmit()}
                            className="btn btn-warning"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => handleShow(false)}
                            className="btn btn-success"
                        >
                            No
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}