"use client"
import React, {useEffect, useState} from 'react';
import { Search } from '@/types/search';
import BasicCard from '@/components/Card/BasicCard';
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import {AddAllAttributes, AddAllColor, AddListProduct, UpdateFilter} from "@/app/redux/features/product/product.redux";
import {ColorDetailInp, TagsProductDto} from "@/lib/dtos/Product";
import {ColorDetailType, NavigationItem, SearchProductType, TagsDetailType} from "@/types";
import {getColorProductApi, getTagsProductApi, makeRequestApi, searchProductWithOptionsApi} from "@/lib/api";
import {useSession} from "next-auth/react";
import Navigation from "@/components/Navigation";

export default function ProductSearch() {
    const { data: session } = useSession();
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
            </>)
        } as NavigationItem,
        {
            title: "Search",
            href: "/search",
            icon: (<>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                </svg>

            </>)
        } as NavigationItem
    ])
    const productList = useAppSelector((state) => state.ProductRedux.listProduct);
    const categoryList = useAppSelector((state) => state.CategoryRedux.value);
    const attributesList = useAppSelector(
        (state) => state.ProductRedux.attributesList,
    );
    const filter = useAppSelector((state) => state.ProductRedux.filter);
    const colorList = useAppSelector((state) => state.ProductRedux.colorList)
    const dispatch = useAppDispatch();
    const [maxValue, setMaxValue] = useState<number>(0)
    const UpdateAllTag = async () => {
        const dtoTag: TagsProductDto = {
            tags: null,
        };
        const responseTags: TagsDetailType[] = await getTagsProductApi(dtoTag, null)
        dispatch(AddAllAttributes(responseTags));

        const dtoColor: ColorDetailInp = {
            colorName: null,
        };
        const responseColors: ColorDetailType[] = await getColorProductApi(dtoColor, null)
        dispatch(AddAllColor(responseColors));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseProduct: SearchProductType = await searchProductWithOptionsApi(filter, null)

                await UpdateAllTag();
                setMaxValue(responseProduct.maxValue)
                dispatch(AddListProduct(responseProduct.data));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [dispatch, session, filter]);



    const handlePageChange = (page: number) => {
        const count = filter.count ?? 0;

        if (page >= 1 && page <= maxValue / count) {
            dispatch(UpdateFilter({ ...filter, index: page }));
        }
    }
    return (
       <>
       
        <div className="container mx-24 p-4">
            <Navigation item={navigation}></Navigation>
            <div className="flex flex-col gap-3 md:flex-row mt-10">
                <div className="flex w-full">
                    <input
                        value={filter.name || ""}
                        onChange={(e) =>
                            dispatch(UpdateFilter({...filter, name: e.target.value}))
                        }
                        type="text"
                        placeholder="Search product name"
                        className="h-10  rounded-l  input-bordered input-success w-full px-3 text-black input"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:flex-row mt-4">
                {/* Sort Filter */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">Sort:</span>
                    <select
                        value={filter.sort || ""}
                        onChange={(e) =>
                            dispatch(UpdateFilter({...filter, sort: e.target.value}))
                        }
                        className="select select-ghost w-full max-w-xs font-bold"
                    >
                        <option disabled>Choose a sort type</option>
                        <option value="updated_at_desc">Updated Date: Newest</option>
                        <option value="updated_at_asc">Updated Date: Oldest</option>
                        <option value="created_at_desc">Created Date: Newest</option>
                        <option value="created_at_asc">Created Date: Oldest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>

                {/* Range Money Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Price Range:</span>
                    <div className="flex flex-col items-start gap-2">
                        <input
                            type="range"
                            min={0}
                            max={filter.rangeMoney?.[1] || 1000000}
                            step="10"
                            value={filter.rangeMoney?.[0] || 0}
                            onChange={(e) => {
                                const updatedRange = [
                                    Number(e.target.value),
                                    filter.rangeMoney?.[1] || 1000000,
                                ];
                                dispatch(UpdateFilter({...filter, rangeMoney: updatedRange}));
                            }}
                            className="range range-primary"
                        />
                        <div className="flex flex-col items-start gap-2">
                          <span className="text-sm">
                            Min: {filter.rangeMoney?.[0] || 0}
                          </span>

                        <span className="text-sm">
                            Max: {filter.rangeMoney?.[1] || 1000000}
                          </span>
                        </div>
                    </div>
                </div>

                {/* Brand Filter */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">Brands:</span>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            Brands
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content z-[1] rounded-box bg-base-100 p-2 shadow"
                        >
                            {attributesList && Array.isArray(attributesList) && attributesList
                                .filter((it) => it.type.toLowerCase() === "brand")
                                .map((it) => (
                                    <li key={it.value} className="flex items-center gap-2">
                                        <div className="form-control">
                                            <label className="label cursor-pointer gap-2">
                                                <span className="label-text">{it.value}</span>
                                                <input
                                                    type="checkbox"
                                                    value={it.value}
                                                    checked={
                                                        filter.brand?.some((c) => c.value === it.value) ??
                                                        false
                                                    }
                                                    onChange={(e) => {
                                                        const updatedItem = e.target.checked
                                                            ? [
                                                                ...(filter.brand || []),
                                                                {type: it.type, value: it.value},
                                                            ]
                                                            : filter.brand?.filter(
                                                                (c) => c.value !== it.value,
                                                            );
                                                        dispatch(
                                                            UpdateFilter({...filter, brand: updatedItem}),
                                                        );
                                                    }}
                                                    className="checkbox-info checkbox"
                                                />
                                            </label>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                {/* Color Filter */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">Color:</span>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            Colors
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content z-[1] rounded-box bg-base-100 p-2 shadow"
                        >
                            {colorList && Array.isArray(colorList) && colorList.map((color) => (
                                <li key={color.colorName} className="flex items-center gap-2">
                                    <div className="form-control">
                                        <label className="label cursor-pointer gap-2">
                                            <span className="label-text">{color.colorName}</span>
                                            <input
                                                type="checkbox"
                                                value={color.colorName}
                                                checked={
                                                    filter.color?.some(
                                                        (c) => c.value === color.colorName,
                                                    ) ?? false
                                                }
                                                onChange={(e) => {
                                                    const updatedColors = e.target.checked
                                                        ? [
                                                            ...(filter.color || []),
                                                            {type: "color", value: color.colorName},
                                                        ]
                                                        : filter.color?.filter(
                                                            (c) => c.value !== color.colorName,
                                                        );
                                                    dispatch(
                                                        UpdateFilter({...filter, color: updatedColors}),
                                                    );
                                                }}
                                                className="checkbox-info checkbox"
                                            />
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium">Category:</span>
                    <select
                        value={filter.category || ""}
                        onChange={(e) =>
                            dispatch(UpdateFilter({...filter, category: e.target.value}))
                        }
                        className="select select-ghost w-full max-w-xs font-bold"
                    >
                        <option disabled selected>
                            Chosen a category
                        </option>
                        <option value="">All Categories</option>
                        {categoryList.map((category) => (
                            <option key={category.name} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="w-full gap-8">
                <div className="relative w-full h-full shadow-lg p-6 border rounded-lg bg-white">
                    <h1 className="text-xl font-bold text-red-500 mb-4">
                        Tìm kiếm điện thoại
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {productList.map((item) => (
                            <BasicCard key={item.id} item={item}/>
                        ))}
                    </div>
                    <div className="flex justify-center items-center space-x-2 mt-6">
                        <div className="join">
                            <button className="join-item btn" onClick={() => handlePageChange(filter.index-1)}>«</button>
                            <button className="join-item btn">Page {filter.index}</button>
                            <button className="join-item btn" onClick={() => handlePageChange(filter.index+1)}>»</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       </>
    );

};       
