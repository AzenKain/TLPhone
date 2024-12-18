"use client"
import { useRouter } from 'next/navigation'
import {ProductType, UserType} from "@/types";
import {Backend_URL} from "@/lib/Constants";
import React from "react";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {useSession} from "next-auth/react";
import {makeRequestApi, updateHeartApi } from "@/lib/api";
import {UpdateUser} from "@/app/redux/features/user/user.redux";
import {toast} from "react-toastify";

const BasicCard: React.FC<{ item: ProductType }> = ({ item }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const userDetail = useAppSelector((state) => state.UserRedux.value)
  const dispatch = useAppDispatch()
  const displayPrice = item.details?.variants?.[0]?.displayPrice;
  const imgUrl = item.details?.imgDisplay?.[0]?.url ? Backend_URL + item.details?.imgDisplay?.[0]?.url : "./no-item-found.png";

  const handlerUpdateHeart = async () => {
    let dto : number[] = [...userDetail.heart]
    if (userDetail.heart.includes(Number(item.id))) {
      dto = dto.filter(it => it !== Number(item.id))
    }
    else {
      dto.push(Number(item.id))
    }

    let dataUser: UserType = await makeRequestApi(updateHeartApi, dto, session?.expires, session?.access_token)
    console.log(dataUser)
    if (dataUser) {
      dispatch(UpdateUser(dataUser))
      toast.success("Update heart successful!!");
    }
    else {
      toast.error("Update heart failed!!");
    }
  }
  return (
      <div className='border rounded-lg shadow p-4 hover:shadow-md transition bg-amber-50 w-50 h-80 ' >
        <div className="">
          <div className="pt-2 relative">
            {userDetail.id != "-1" && (
                <div className='absolute top-2 right-2' onClick={async () => await handlerUpdateHeart()}>
                  {userDetail.heart.includes(Number(item.id)) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                           className="w-6 h-6 text-red-500">
                        <path
                            d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"/>
                      </svg>
                  ) : (
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 text-red-500"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                  )}

                </div>
            )}

            <p className="ms-2 rounded-full p-1 bg text-center mb-2 "
               style={{fontSize: "10px", maxWidth: "max-content"}}>Trả góp 0%
            </p>
            <div className="cursor-pointer flex justify-center group w-full h-full" onClick={() => router.push(`/product/${item.id}`)}>
              <img

                  className="rounded-md w-24 h-32 object-fit-fill transform transition duration-100 group-hover:scale-105"
                  src={imgUrl}
                  alt=""
                  width={110}
                  height={220}

              />

            </div>
            <div className="cursor-pointer p-2 mt-3 w-full " onClick={() => router.push(`/product/${item.id}`)}>
              <p className="text-sm w-full" >{item.name}</p>
              <div className="flex flex-row">
                <p className="mt-2" style={{color: "crimson"}} >
                  <strong>
                    {displayPrice
                        ? (displayPrice * (100 - 0) / 100).toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })
                        : 'N/A'}
                  </strong>
                </p>
                <p className="ms-2 bg2 rounded-md mt-3 px-1">-{0}%</p>
              </div>
              <p className="gach-ngang">
                {displayPrice
                    ? displayPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })
                    : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default BasicCard
