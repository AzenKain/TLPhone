"use client"
import { useRouter } from 'next/navigation'
import React from "react";
import {NavigationItem} from "@/types";
import Link from "next/link"

const Navigation: React.FC<{ item: NavigationItem[] }> = ({ item }) => {
    const router = useRouter()
    return (
        <div className="top-[68px] fixed z-[999] left-0 w-full px-28 h-[40px] shadow-1dtv bg-[#fff]">
            <div className="w-full h-full m-auto overflow-hidden">
                <ul className="h-full flex overflow-x-auto overflow-y-hidden hidden-scroll">
                    {item.map((v, i) => {
                        return (
                            <li key={i} className="h-full shrink-0 flex items-center gap-2">
                                {v.icon !== null ? (v.icon) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        role="img"
                                        className="icon text-[#3f3f3f] text-sm mr-[10px]"
                                        style={{}}
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 24 24"
                                        data-v-dc707951=""
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z"
                                        />
                                    </svg>
                                )}

                                <Link
                                    href={v.href}
                                    className="text-xs mr-[10px] hover:text-dtv"
                                >
                                    {v.title}
                                </Link>
                            </li>
                        );
                    })}

                </ul>
            </div>
        </div>
    )
}

export default Navigation