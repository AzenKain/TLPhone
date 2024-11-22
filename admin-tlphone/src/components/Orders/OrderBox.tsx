'use client'
import { AddListOrder, SearchOrder, UpdateOrder } from "@/app/redux/features/order/order.redux";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getAllOrderApi, getAllUserApi, getProductByIdApi, getTopProductApi, makeRequestApi, updateOrderApi } from "@/lib/api";
import { updateOrderDto } from "@/lib/dtos/order";
import { OrderType } from "@/types/order";
import { ProductType } from "@/types/product";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import InvoiceCard from "../Invoices/InvoiceBox";
import { UserType } from "@/types/user";
import { AddListUser } from "@/app/redux/features/listUser/listUser.redux";

const SalesBox = () => {
    const { data: session } = useSession()
    const dispatch = useAppDispatch()
    const listOrder = useAppSelector((state) => state.OrderRedux.value)
    const [dataItems, setDataItems] = useState<{ [productId: string]: ProductType }>({})
    const [itemsShow, setItemsShow] = useState<OrderType | null>(null)
    const elementSelect = {
        element: ["Processing", "In transit", "Delivered", "Cancelled"],
    }
    const [orderStatus, setOrderStatus] = useState<string>("")
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchFilter, setSearchFilter] = useState<string>("all");

    const handleSearch = () => {
        dispatch(SearchOrder({ value: searchValue, filter: searchFilter }))
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataOrder: OrderType[] = await makeRequestApi(getAllOrderApi, null, session?.refresh_token, session?.access_token);
                if (!dataOrder) return;
                dispatch(AddListOrder(dataOrder))
                let newDataItems: { [productId: string]: ProductType } = {};
                for (let i = 0; i < dataOrder.length; i++) {
                    for (let j = 0; j < dataOrder[i].listProducts.length; j++) {
                        let productId: string = dataOrder[i].listProducts[j].productId
                        if (newDataItems[productId]) continue;
                        let tmpDataItem: ProductType = await getProductByIdApi(productId)
                        newDataItems[productId] = tmpDataItem
                    }
                }
                setDataItems(newDataItems)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (session?.userId && session?.refresh_token && session?.access_token) {
            fetchData();
        }
    }, [session, dispatch])

    const handleSubmit = async () => {
        let dto: updateOrderDto = {
            status: orderStatus,
            isPaid: itemsShow?.isPay?.isPaid ?? false,
            orderId: itemsShow?.id ?? ""
        }
        const responseData: OrderType = await makeRequestApi(updateOrderApi, dto, session?.refresh_token, session?.access_token);
        if (responseData) {
            dispatch(UpdateOrder(responseData))
            toast.success("Update order successfully")
            const modal = document.getElementById("my_modal_edit") as HTMLDialogElement | null;
            if (modal) {
                modal.close();
            }
        }
        else {
            toast.error("Update order failed")
        }
    }

    const handleShow = (items: OrderType, model: string) => {
        const modal = document.getElementById(model) as HTMLDialogElement | null;
        setItemsShow(items)
        setOrderStatus(items?.status ?? "")
        if (modal) {
            modal.showModal();
        }
    }


    return (
        <div className="flex flex-col gap-10 mt-2">
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex w-full">
                    <input
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        type="text"
                        placeholder="Search for the tool you like"
                        className="w-full text-black dark:text-white  px-3 h-10 rounded-l border-2 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                    />
                    <button
                        onClick={() => handleSearch()}
                        type="submit"
                        className="bg-sky-500 text-black dark:text-white rounded-r px-2 md:px-3 py-0 md:py-1"
                    >
                        Search
                    </button>
                </div>
                <select
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    id="pricingType"
                    name="pricingType"
                    className="h-10 border-2 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark text-black dark:text-white rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
                >
                    <option value="all">All</option>
                    <option value="id">Id</option>
                    <option value="userId">User id</option>
                    <option value="email">Email</option>
                </select>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-between px-4 md:px-6 xl:px-7.5">
                    <h4 className="my-4 text-4xl font-semibold text-black dark:text-white">
                        List Order
                    </h4>
                </div>
                {listOrder?.map((orderData, index) => (
                    <div key={orderData?.id} className="w-full mt-2 mb-10 max-w-7xl px-4 md:px-5 lg-6 mx-auto">
                        <div className="flex items-center gap-1 w-full mb-2">
                            <div
                                className="text-black dark:text-white text-2xl w-24 mx-4"
                            >
                                Controller:
                            </div>
                            <div
                                onClick={() => handleShow(orderData, "my_modal_view")}
                                className="btn btn-info w-24"
                            >
                                Get Bill
                            </div>
                            <div
                                onClick={() => handleShow(orderData, "my_modal_edit")}
                                className="btn btn-success w-24"
                            >
                                Edit
                            </div>
                        </div>

                        <div className="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                                <div className="data">
                                    <p className="font-semibold text-base leading-7 text-black dark:text-white ">Order Id: <span className="text-indigo-600 font-medium">{orderData?.id}</span></p>
                                    <p className="font-semibold text-base leading-7 text-black dark:text-white  mt-4">Order Payment : <span className="text-gray-400 font-medium">{new Date(orderData?.createdAt ?? "").toUTCString()}</span></p>
                                </div>
                                <div className="text-center text-3xl font-bold border-4 bg-gray-300 px-4 py-2 rounded-full">
                                    {orderData.isPay?.isPaid ? "Paid" : "UnPaid"}
                                </div>

                            </div>
                            <div className="w-full px-3 min-[400px]:px-6">
                                {orderData?.listProducts.map((product, index) => (
                                    <div key={index} className="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
                                        <div className="img-box max-lg:w-full">
                                            <Image
                                                src={dataItems[product.productId]?.imgDisplay.find(img => img?.link?.includes(product.color.toLowerCase()))?.url ?? ""}
                                                width={100}
                                                height={100}
                                                alt={`${dataItems[product.productId]?.productName}`}
                                                className="aspect-square w-full lg:max-w-[140px]"
                                            />
                                        </div>
                                        <div className="flex flex-row items-center w-full ">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
                                                <div className="flex items-center">
                                                    <div>
                                                        <h2 className="font-semibold text-xl leading-8 text-black dark:text-white  mb-3">
                                                            {dataItems[product.productId]?.productName}
                                                        </h2>
                                                        <p className="font-normal text-lg leading-8 text-gray-500 mb-3 ">
                                                            By: {dataItems[product.productId]?.detail?.company}</p>
                                                        <div className="flex items-center ">
                                                            <p className="font-medium text-base leading-7 text-black dark:text-white  pr-4 mr-4 border-r border-gray-200">
                                                                Size:
                                                                <span className="text-gray-500">
                                                                    {product.size}
                                                                </span>
                                                            </p>
                                                            <p className="font-medium text-base leading-7 text-black dark:text-white  pr-4 mr-4 border-r border-gray-200">
                                                                Color:
                                                                <span className="text-gray-500">
                                                                    {product.color}
                                                                </span>
                                                            </p>
                                                            <p className="font-medium text-base leading-7 text-black dark:text-white  ">
                                                                Qty:
                                                                <span className="text-gray-500">
                                                                    {product.quantity}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-5">
                                                    <div className="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                                                        <div className="flex gap-3 lg:block">
                                                            <p className="font-medium text-sm leading-7 text-black dark:text-white ">Price</p>
                                                            <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">{product.price}đ</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                                                        <div className="flex gap-3 lg:block">
                                                            <p className="font-medium text-sm leading-7 text-black dark:text-white ">
                                                                Status
                                                            </p>
                                                            <p className="font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 bg-indigo-50 text-emerald-600">
                                                                {orderData.status}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                                                        <div className="flex gap-3 lg:block">
                                                            <p className="font-medium text-sm whitespace-nowrap leading-6 text-black">
                                                                Expected Delivery Time</p>
                                                            <p className="font-medium text-base whitespace-nowrap leading-7 lg:mt-3 text-emerald-500">
                                                                {new Date(new Date(orderData?.createdAt ?? "").setDate(new Date(orderData?.createdAt ?? "").getDate() + 7)).toDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between ">
                                <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200 ml-2">
                                    <p className=" font-medium text-lg text-gray-900 pl-6 py-3 max-lg:text-center">Payment method: <span className="text-gray-500">{orderData.paymentMethods}</span></p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <p className="font-semibold text-lg text-black dark:text-white  py-6">Shipping: <span className="text-indigo-600">
                                        {orderData.deliveryType == "STANDARD" ? 25000 : orderData.deliveryType == "FAST" && 50000}đ
                                    </span></p>
                                    <p className="font-semibold text-lg text-black dark:text-white  py-6">Total Price:
                                        <span className="text-indigo-600">
                                            {orderData.totalAmount && (orderData.totalAmount * 1.1 + (orderData.deliveryType == "STANDARD" ? 25000 : orderData.deliveryType == "FAST" ? 50000 : 0)).toFixed(3)}đ
                                            <span className="text-base text-red-500">
                                                {" (+10% tax)"}
                                            </span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <dialog id="my_modal_edit" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2 text-3xl">✕</button>
                    </form>
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-3xl my-4">Edit Order</h3>

                        <div className="mb-2">
                            <label className="label-text text-xl">
                                Product Type
                            </label>

                            <div className="relative z-20 bg-transparent dark:bg-form-input">
                                <select
                                    value={orderStatus}
                                    onChange={(e) => {
                                        setOrderStatus(e.target.value)
                                    }}
                                    className={`relative z-20 w-full appearance-none rounded border  px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${orderStatus ? "label-text text-lg" : ""
                                        }`}
                                >
                                    {elementSelect.element.map((item, index) => (
                                        <option key={index} value={item} className="text-lg">
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                                    <svg
                                        className="fill-current"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g opacity="0.8">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                fill=""
                                            ></path>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div className="form-control w-65 mb-2">
                            <label className="cursor-pointer label">
                                <span className="label-text text-xl">Is Paid</span>
                                <input
                                    onChange={e => {
                                        setItemsShow(prevItems => {
                                            if (prevItems) {
                                                const newItems = { ...prevItems };
                                                if (newItems.isPay) {
                                                    newItems.isPay = { ...newItems.isPay, isPaid: e.target.checked }
                                                }
                                                return newItems;
                                            }
                                            return null;
                                        });
                                    }}
                                    type="checkbox"
                                    className="toggle toggle-error"
                                    checked={itemsShow?.isPay?.isPaid}
                                />
                            </label>
                        </div>
                        <button
                            onClick={async () => await handleSubmit()}
                            className="btn btn-success"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </dialog>
            <dialog id="my_modal_view" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <form method="dialog">
                        <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2 text-3xl">✕</button>
                    </form>
                    <div className="mt-4">
                        <InvoiceCard itemsShow={itemsShow} dataItems={dataItems} />
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default SalesBox;