"use client"
import React, {useEffect, useState} from 'react';
import { Product } from "@/types/listproduct";
import Navigation from "@/components/Navigation";
import {
    CartType,
    NavigationItem,
    ProductType,
    ProductVariantType,
    SchemaProductType,
    SearchProductType,
    UserType
} from "@/types";
import {
    getAllSchemaProductApi,
    getSchemaProductByName,
    getProductByIdApi,
    makeRequestApi,
    searchProductWithOptionsApi, getUserByIdApi, updateCartApi
} from "@/lib/api";
import {useSession} from "next-auth/react";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import { UpdateCategoryDisplay} from "@/app/redux/features/category/category.redux";
import {UpdateProductDisplay} from "@/app/redux/features/product/product.redux";
import {SearchProductDto} from "@/lib/dtos/Product";
import Link from "next/link";
import {Backend_URL} from "@/lib/Constants";
import BasicCard from "@/components/Card/BasicCard";
import {CartItemInp, UpdateCartDto} from "@/lib/dtos/user";
import {UpdateUser} from "@/app/redux/features/user/user.redux";
import {toast} from "react-toastify";
export default function Page({params,}: { params: { productId: string }; }) {
    const [navigation, setNavigation] = useState<NavigationItem[]>([
        {
            title: "Home",
            href: "/",
            icon: (<>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                </svg>
            </>),

        } as NavigationItem
    ])
    const userDetail = useAppSelector((state) => state.UserRedux.value)
    const product = useAppSelector((state) => state.ProductRedux.productDisplay);
    const category = useAppSelector((state) => state.CategoryRedux.categoryDisplay);
    const { data: session } = useSession()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(true)
    const [listCare, setListCare] = useState<ProductType[]>([])
    const [listSame, setListSame] = useState<ProductType[]>([])
    const [selectedOption, setSelectedOption] = useState<ProductVariantType | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const [quantity, setQuantity] = useState(1);
    const handleIncrease = () => {
        if (!selectedOption?.stockQuantity) {
            return;
        }
        if (quantity >= selectedOption.stockQuantity) {
            return;
        }
        setQuantity(prev => prev + 1);
    };
    const handleDecrease = () => {
        if (!selectedOption?.stockQuantity) {
            return;
        }
        if (quantity <= 1) {
            return;
        }
        setQuantity(prev => prev - 1);
    }
    useEffect(() => {
        const fetchData = async () => {
            let dataProduct: ProductType = await getProductByIdApi(
                Number(params.productId),
                null
            )
            if (!dataProduct) {
                return
            }
            // dispatch()
            const responseCategory : SchemaProductType = await getSchemaProductByName(
                dataProduct?.category || "",
                null,
            );
            if (!responseCategory) {
                return
            }
            let filter: SearchProductDto = {
                index: 1,
                count: 4,
                sort: 'updated_at_desc',
                brand: [
                    {
                        type: 'brand',
                        value: typeof dataProduct?.details?.brand === 'string' ? dataProduct?.details?.brand : String(dataProduct?.details?.brand ?? ""),
                    }
                ]
            };
            let responseProduct: SearchProductType = await searchProductWithOptionsApi(filter, null)
            setListCare(responseProduct.data)

            filter.count = 5
            responseProduct= await searchProductWithOptionsApi(filter, null)
            setListSame(responseProduct.data)



            setLoading(false)
            setSelectedOption(dataProduct?.details?.variants ? dataProduct?.details?.variants[0] : null)
            dispatch(UpdateProductDisplay(dataProduct));
            dispatch(UpdateCategoryDisplay(responseCategory));
            setNavigation(prevNavigation => {
                if (!prevNavigation.some(item => item.href === `/product/${dataProduct.id}`)) {
                    return [
                        ...prevNavigation,
                        {
                            title: dataProduct.name,
                            href: `/product/${dataProduct.id}`,
                            icon: (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                         stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>
                                    </svg>
                                </>
                            ),
                        } as NavigationItem,
                    ];
                }
                return prevNavigation;
            });

        }

        fetchData();

    }, [dispatch, session])

    if (loading) {
        return (
            <div className="flex items-center text-7xl justify-center h-72 w-screen bg-gray-100">
                Loading
                <span className="loading loading-infinity w-40">

                </span>
            </div>
        );
    }

    const handleUpdateCart = async () => {
        if (selectedOption == null || quantity == 0) {
            return;
        }
        const dto: UpdateCartDto = {
            cartProducts: userDetail.cart.cartProducts.map(it => ({
                quantity: it.quantity,
                productId: Number(it.product.id),
                productVariantId: Number(it.productVariant.id)
            }))
        };

        const newIt = dto.cartProducts.findIndex(it => it.productId === Number(product.id)
            && it.productVariantId === Number(selectedOption.id)
        )
        if (newIt !== -1) {
            dto.cartProducts[newIt].quantity += quantity
        }
        else {
            dto.cartProducts.push({quantity: quantity, productId: Number(product.id), productVariantId: Number(selectedOption.id)  } as CartItemInp)
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


    return (
        <div className="mx-2 lg:mx-4 xl:mx-16 ">
            <Navigation item={navigation}></Navigation>
            <div className="mt-12 w-full">
                <h1 className="text-2xl font-bold">
                    {product.name}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-5  lg:grid-cols-8 gap-4">
                    <div className="flex flex-wrap -mx-4 border p-4 rounded-lg md:col-span-3 lg:col-span-3">
                        {/* Product Images */}
                        <div className="w-full px-4 mb-8">
                            <img
                                src={
                                    product.details?.imgDisplay?.find(i => {
                                        const colorValue = selectedOption?.attributes?.find(
                                            x => x?.type?.toLowerCase() === "color"
                                        )?.value;
                                        return i?.link?.find(e => e.toLowerCase() === colorValue?.toLowerCase());
                                    })?.url || "/no-item-found.png"
                                }
                                alt="Product"
                                className="w-full h-auto rounded-lg shadow-md mb-4"
                                id="mainImage"
                            />
                            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                                {product.details?.imgDisplay?.map(it => {
                                    return (
                                        <img
                                            key={it.id}
                                            src={it.url || "/no-item-found.png"}
                                            alt="Thumbnail 1"
                                            className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                                        />
                                    )
                                })}

                            </div>
                        </div>
                    </div>
                    <div className="border p-4 rounded-lg space-y-4 md:col-span-2 lg:col-span-3 w-full">

                        <div className="my-2">
                            <p className="flex gap-2 flex-col lg:flex-row text-lg md:text-2xl text-red-600 font-bold">
                                {selectedOption
                                    ? selectedOption.displayPrice.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })
                                    : "0 đ"}{" "}
                                <span className="line-through text-base text-gray-500">
                                    {selectedOption
                                        ? selectedOption.displayPrice.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })
                                        : "0 đ"}
                                </span>
                            </p>

                        </div>
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">Cấu hình:</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                {product?.details?.variants?.map((it) => {
                                    return (
                                        <button
                                            key={it.id}
                                            className={` py-2 w-full border rounded-lg ${
                                                selectedOption?.id === it.id
                                                    ? "bg-cyan-500 text-white"
                                                    : "hover:bg-gray-200"
                                            }`}
                                            onClick={() => setSelectedOption(it)}
                                        >
                                            <div className="flex flex-row justify-center gap-2 w-full">

                                                <img
                                                    className="w-10 h-10 object-fit-contain"
                                                    src={
                                                        product.details?.imgDisplay?.find(i => {
                                                            const colorValue = it?.attributes?.find(
                                                                x => x?.type?.toLowerCase() === "color"
                                                            )?.value;
                                                            return i?.link?.find(e => e.toLowerCase() === colorValue?.toLowerCase());
                                                        })?.url || "/no-item-found.png"
                                                    }
                                                    alt=""
                                                />
                                                <div
                                                    className="w-10 h-10 "
                                                    style={{
                                                        backgroundColor:
                                                            product.details?.color?.find(i => {
                                                                const colorValue = it?.attributes?.find(
                                                                    x => x?.type?.toLowerCase() === "color"
                                                                )?.value;
                                                                return i?.colorName?.toLowerCase() === colorValue?.toLowerCase();
                                                            })?.colorHex || "transparent",
                                                    }}
                                                />
                                            </div>

                                            {it.attributes?.map((v) => v.value).join("|") || "N/A"}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                        <div className="grid grid-cols-4 gap-4 w-full">
                            <div className='col-span-2'>
                                <div className="flex items-center space-x-3 border rounded-md ms-1"
                                     style={{width: "max-content"}}>
                                    <button
                                        onClick={handleDecrease}
                                        className="bg-stone-100 px-3 w-16 h-10 text-3xl rounded-s-md hover:bg-slate-200 border-e"
                                    >
                                        -
                                    </button>
                                    <input
                                        value={quantity}
                                        onChange={e => {
                                            const newValue = e.target.value.replace(/[^0-9]/g, '');
                                            if (newValue !== ''
                                                && Number(newValue) >= 0
                                                && Number(newValue)
                                                && selectedOption?.stockQuantity
                                                && Number(newValue) <= selectedOption?.stockQuantity
                                            ) {
                                                setQuantity(Number(newValue));
                                            }
                                        }}
                                        className="text-2xl  text-center input input-bordered input-info w-16 h-10"
                                        type="text"
                                    />
                                    <button
                                        onClick={handleIncrease}
                                        className="bg-stone-100 w-16 h-10 text-3xl px-3 rounded-e-md hover:bg-slate-200 border-s"
                                    >
                                        +
                                    </button>
                                </div>

                            </div>
                            <div className='flex col-span-2 justify-start items-center h-full'>
                                <div className="font-bold text-xl flex flex-row gap-2">
                                    <span className="font-bold text-xl ">Số lượng:</span>
                                    <span className="font-bold text-xl text-red-500">{`(${selectedOption?.stockQuantity})`}</span>
                                </div>

                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
                            <div className="flex flex-row  md:col-span-4 btn bg-red-500 text-white">
                                Mua hàng ngay
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                                </svg>

                            </div>
                            <div onClick={async () => await handleUpdateCart()}
                                 className="flex flex-row md:col-span-2 btn rounded-md border-2 border-cyan-300 gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-4 lg:size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                                </svg>
                                <div className="md:text-[10px]">Thêm vào giỏ</div>
                            </div>
                            <div className="md:col-span-4">
                                <button
                                    className="bg-gray-200 flex gap-2 items-center w-full justify-center text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                    </svg>
                                    Wishlist
                                </button>
                            </div>
                            <div className="md:col-span-6 p-4 rounded-lg break-words">
                                <h2 className="text-xl text-blue-500 font-bold">Thông tin sản phẩm</h2>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Máy mới nguyên seal 100%.</li>
                                    <li>
                                        Bộ sản phẩm: Thân máy, Hộp, Cáp, Cây lấy sim, Sách hướng dẫn.
                                    </li>
                                    <li>Bảo hành chính hãng 12 tháng, đổi mới trong vòng 33 ngày.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border p-4 rounded-lg space-y-4 md:col-span-5 lg:col-span-2 w-full">
                        <div className="w-full h-10 bg-red-600 rounded-md  flex items-center justify-center">
                            <h1 className="text-xl md:text-lg font-bold text-white">
                                Có thể bạn quan tâm
                            </h1>
                        </div>
                        <div className="flex flex-col w-full">
                            {listCare.map(it => {
                                return (
                                    <div key={it.id} className='flex flex-row w-full gap-6'>
                                        <img
                                            src={it.details?.imgDisplay?.[0]?.url ? Backend_URL + it.details?.imgDisplay?.[0]?.url : "./no-item-found.png"}
                                            alt=""
                                            className="w-32 h-32 object-fit-contain"
                                        />
                                        <div className="break-words">
                                            <Link href={`/product/${it.id}`} className="font-bold break-words">{it.name}</Link>
                                            <div className="text-red-600 break-words font-semibold">
                                                {it.details?.variants?.[0]?.displayPrice
                                                ? (it.details?.variants?.[0]?.displayPrice * (100 - 0) / 100).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })
                                                : 'N/A'}</div>
                                            <Link href={`/product/${it.id}`} className="text-blue-500 break-words">Xem chi tiết</Link>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                </div>


                <div className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Phần thông tin sản phẩm */}
                        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6"
                             style={{height: "max-content"}}>
                            <div className="mb-6">
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white">
                                    Description
                                </label>
                                <div
                                    className="text-base"
                                    dangerouslySetInnerHTML={{__html: Buffer.from(product.details.description || "", "base64").toString("utf-8")}}
                                />
                            </div>
                            <button className="text-center text-red-500 font-bold">Xem thêm</button>
                        </div>


                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-bold text-red-500 mb-4">Thông số kỹ thuật</h2>
                            <div className="space-y-6">
                                {category && (
                                    <div>
                                        {category.detail.slice(0, Math.ceil(category.detail.length / 2)).map((detail, idx) => (
                                            <div key={detail.id} className="mb-5">
                                                <h3 className="font-bold mb-2">{`${idx + 1}, ${detail.title}`}</h3>
                                                <div className="space-y-2">
                                                    {detail.attributes.map((attr) => (
                                                        <div key={attr.id} className="flex justify-between border-b pb-2">
                                                            <span className="font-semibold">{attr.value}</span>
                                                            <span className="text-gray-700">
                                                              {product?.details?.attributes &&
                                                                  product?.details?.attributes
                                                                      .filter((it) => it.type === attr.value)
                                                                      .map((v) => v.value)
                                                                      .join(", ")}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isExpanded && (
                                <div className="space-y-6 mt-6">
                                    {category && (
                                        <div>
                                            {category.detail.slice(Math.ceil(category.detail.length / 2)).map((detail, idx) => (
                                                <div key={detail.id} className="mb-5">
                                                    <h3 className="font-bold mb-2">{`${idx + 1 + Math.ceil(category.detail.length / 2)}, ${detail.title}`}</h3>
                                                    <div className="space-y-2">
                                                        {detail.attributes.map((attr) => (
                                                            <div key={attr.id} className="flex justify-between border-b pb-2">
                                                                <span className="font-semibold">{attr.value}</span>
                                                                <span className="text-gray-700">
                                                                    {product?.details?.attributes &&
                                                                        product?.details?.attributes
                                                                            .filter((it) => it.type === attr.value)
                                                                            .map((v) => v.value)
                                                                            .join(", ")}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={toggleExpand}
                                className="text-red-500 font-bold mt-4 flex justify-center w-full"
                            >
                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>

                    </div>
                </div>

                <div className="w-full my-4 gap-8">
                    <div className="relative w-full h-full shadow-lg p-6 border rounded-lg bg-white">
                        <h1 className="text-xl font-bold text-red-500 mb-4">
                            Sản phẩm tương tự
                        </h1>
                        <div className="grid lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 grid-cols-2  gap-4 items-center">
                            {listSame.slice(0, 5).map((item, index) => (
                                <BasicCard key={index} item={item}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

