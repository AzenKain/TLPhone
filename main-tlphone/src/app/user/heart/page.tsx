"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {ProductType, UserType} from "@/types";
import {getListProductByIdApi, getUserByIdApi, makeRequestApi} from "@/lib/api";
import {UpdateUser} from "@/app/redux/features/user/user.redux";
import {AddListProduct} from "@/app/redux/features/product/product.redux";
import BasicCard from "@/components/Card/BasicCard";
export default function Heart() {
    const { data: session } = useSession()
    const userDetail = useAppSelector((state) => state.UserRedux.value)
    const productList = useAppSelector((state) => state.ProductRedux.listProduct);

    const dispatch = useAppDispatch()
    useEffect(() => {
        const fetchData = async () => {
            let dataUser: UserType = await makeRequestApi(getUserByIdApi, session?.userId, session?.refresh_token, session?.access_token)
            dispatch(UpdateUser(dataUser));
            if (dataUser.heart.length == 0) {
                return;
            }
            let dataProduct = await getListProductByIdApi(dataUser.heart, null)
            dispatch(AddListProduct(dataProduct));
        }
        if (session?.userId && session?.refresh_token && session?.access_token) {
            fetchData();
        }
    }, [dispatch, session])


    useEffect(() => {
        const fetchData = async () => {

            let dataProduct = await getListProductByIdApi(userDetail.heart, null)
            dispatch(AddListProduct(dataProduct));
        }
        if (session?.userId && session?.refresh_token && session?.access_token) {
            if (userDetail.heart.length == 0) {
                dispatch(AddListProduct([] as ProductType[]));
                return
            }
            fetchData();
        }
    }, [dispatch, session, userDetail.heart])

    return (
        <div>
            <p className='text-3xl mt-10 ms-24 border-black border-b-2' style={{width:"max-content "}}>Products you like</p>
            <div className='rounded-lg my-5 mx-20'>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {productList.map((item) => (
                        <BasicCard key={item.id} item={item}/>
                    ))}
                </div>
            </div>
        </div>

    );
}