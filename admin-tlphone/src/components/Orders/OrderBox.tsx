"use client";
import {
  AddListOrder,
  SearchOrder,
  UpdateItemSelect,
  UpdateOrderInput,
} from "@/app/redux/features/order/order.redux";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  confirmOrderApi,
  makeRequestApi,
  searchOrderWithOptionApi,
  updateOrderApi,
} from "@/lib/api";
import { OrderType, SearchOrderResponse } from "@/types/order";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import InvoiceCard from "../Invoices/InvoiceBox";
import { Backend_URL } from "@/lib/Constants";
import {
  getNextStatus,
  getOrderStatusFromText,
  getRoadMap,
  OrderStatus,
} from "@/lib/helper/order-status";
import {
  ConfirmOrderDto,
  ConfirmOrderInp,
  UpdateOrderDto,
} from "@/lib/dtos/order";
import { toast } from "react-toastify";
import { UpdateFilter } from "@/app/redux/features/product/product.redux";

const SalesBox = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const listOrder = useAppSelector((state) => state.OrderRedux.value);
  const filter = useAppSelector((state) => state.OrderRedux.filter);
  const orderInput = useAppSelector((state) => state.OrderRedux.orderInput);
  const itemsShow = useAppSelector((state) => state.OrderRedux.itemSelect);
  const [maxValue, setMaxValue] = useState<number>(0);

  const words = [
    "All single",
    "Pending",
    "Confirmed",
    "Delivered",
    "Completed",
    "Cancelled",
    "Refunded",
  ];
  const [selected, setSelected] = useState<number | null>(null);

  const handleImeiChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imei: string,
    orderProductId: number,
  ) => {
    const updatedOrderList = [...orderInput.orderList];

    const productIndex = updatedOrderList.findIndex(
      (n) => n.orderProductId === orderProductId,
    );

    if (productIndex >= 0) {
      const product = updatedOrderList[productIndex];
      const newImeiList = e.target.checked
        ? [...product.imei, imei]
        : product.imei.filter((i) => i !== imei);

      updatedOrderList[productIndex] = {
        ...product,
        imei: newImeiList,
      };
      const updatedData = {
        orderId: Number(itemsShow?.id),
        orderList: updatedOrderList,
      };

      dispatch(UpdateOrderInput(updatedData)); // Dispatch the updated order
    }
  };

  const fetchData = async () => {
    try {
      const dataOrder: SearchOrderResponse = await makeRequestApi(
        searchOrderWithOptionApi,
        filter,
        session?.refresh_token,
        session?.access_token,
      );
      if (!dataOrder) return;
      dispatch(AddListOrder(dataOrder.data));
      setMaxValue(dataOrder.maxValue)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (session?.userId && session?.refresh_token && session?.access_token) {
      fetchData();
    }
  }, [session, dispatch, filter]);

  const handleSubmit = async (next: OrderStatus, isPaid: boolean) => {
    if (itemsShow == null) return;

    if (next === OrderStatus.Confirmed) {
      for (const item of itemsShow.orderProducts) {
        const check = orderInput.orderList.filter(
          (it) => it.imei.length !== item.quantity,
        );
        if (check.length > 0) {
          toast.error("Imei is not valid!");
          return;
        }
      }

      const dataOrder: OrderType = await makeRequestApi(
        confirmOrderApi,
        orderInput,
        session?.refresh_token,
        session?.access_token,
      );
      if (!dataOrder) {
        toast.error("Failed to update order!");
        return;
      }
      dispatch(UpdateItemSelect(dataOrder));
    } else {
      const dto: UpdateOrderDto = {
        orderId: Number(itemsShow.id),
        status: next,
        isPaid: isPaid,
      };
      const dataOrder: OrderType = await makeRequestApi(
        updateOrderApi,
        dto,
        session?.refresh_token,
        session?.access_token,
      );
      if (!dataOrder) {
        toast.error("Failed to update order!");
        return;
      }
      dispatch(UpdateItemSelect(dataOrder));
    }
    toast.success("Update order successfully!");
    await fetchData();
  };

  const handleShow = (items: OrderType, model: string) => {
    const modal = document.getElementById(model) as HTMLDialogElement | null;
    dispatch(UpdateItemSelect(items));
    if (items.status === "Pending") {
      const data: ConfirmOrderDto = {
        orderId: Number(items.id),
        orderList: items.orderProducts.map((it) => {
          return {
            orderProductId: Number(it.id),
            imei: [],
          } as ConfirmOrderInp;
        }),
      };

      dispatch(UpdateOrderInput(data));
    }

    if (modal) {
      modal.showModal();
    }
  };
  const handleClick = (value: string, index: number) => {
    if (value === "All single") value = ""
    dispatch(SearchOrder({ ...filter, status: value }));
    setSelected(index);
  };
  const handlePageChange = (page: number) => {
    const count = filter.count ?? 0;

    if (page >= 1 && page <= maxValue / count) {
      dispatch(UpdateFilter({ ...filter, index: page }));
    }
  };
  return (
    <div className="mt-2 flex flex-col gap-10">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex w-full">
          <input
            value={filter.orderId || ""}
            onChange={(e) =>
              dispatch(SearchOrder({ ...filter, orderId: e.target.value }))
            }
            type="text"
            placeholder="Search for the tool you like"
            className="h-10 w-full rounded-l  border-2 border-stroke bg-white px-3 text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white"
          />
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div
          className="grid w-full grid-cols-2 justify-around border-b bg-white py-5 shadow md:grid-cols-4 lg:grid-cols-7">
          {words.map((item, index) => (
            <button
              key={index}
              onClick={() => handleClick(item, index)}
              className={`mb-2 px-4 py-2 text-lg font-bold ${selected === index ? "border-red-300 border-b" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            List Order
          </h4>
        </div>
        <div
          className="grid grid-cols-2 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:grid-cols-4 md:px-6 lg:grid-cols-7 2xl:px-7.5">
          <div className="col-span-1 flex items-center ">
            <p className="font-medium">Order id</p>
          </div>
          <div className="col-span-1  flex items-center">
            <p className="font-medium">User</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Total amount</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Quantity</p>
          </div>
          <div className="col-span-1  flex items-center">
            <p className="font-medium">Update_At</p>
          </div>
          <div className="col-span-1  flex items-center">
            <p className="font-medium">Created_At</p>
          </div>
          <div className="col-span-1 flex items-center ">
            <p className="font-medium">Controller</p>
          </div>
        </div>

        {listOrder &&
          listOrder?.map((orderData, index) => (
            <div
              className="grid grid-cols-2 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:grid-cols-4 md:px-6 lg:grid-cols-7 2xl:px-7.5"
              key={orderData.id}
            >
              <div className="col-span-1 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                  {orderData?.orderUid || ""}
                </p>
              </div>

              <div className="col-span-1 hidden items-center sm:flex">
                <p className="text-sm text-black dark:text-white">
                  {orderData?.customerInfo.firstName}{" "}
                  {orderData?.customerInfo.lastName}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-cyan-400 ">
                  {orderData?.totalAmount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-meta-3">
                  {orderData?.orderProducts.reduce(
                    (total, product) => total + product.quantity,
                    0,
                  )}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white ">
                  {new Date(orderData?.updated_at ?? "").toDateString()}
                </p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="text-sm text-black dark:text-white">
                  {new Date(orderData?.created_at ?? "").toDateString()}
                </p>
              </div>
              <div className="col-span-1 flex items-center gap-1">
                <div className="dropdown dropdown-end dropdown-bottom">
                  <div tabIndex={0} role="button" className="btn btn-info m-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
                      />
                    </svg>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
                  >
                    <li>
                      <a onClick={() => handleShow(orderData, "my_modal_view")}>
                        Show order
                      </a>
                    </li>
                    <li>
                      <a onClick={() => handleShow(orderData, "my_modal_bill")}>
                        Show bill
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() =>
                          handleShow(orderData, "my_modal_history")
                        }
                      >
                        Show history
                      </a>
                    </li>
                  </ul>
                </div>
                <button
                  aria-label="Submit"
                  onClick={() => handleShow(orderData, "my_modal_edit")}
                  className="btn btn-success"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="flex items-center justify-center space-x-2">
        <div className="join">
          <button
            className="btn join-item"
            onClick={() => handlePageChange(filter.index - 1)}
          >
            «
          </button>
          <button className="btn join-item">Page {filter.index}</button>
          <button
            className="btn join-item"
            onClick={() => handlePageChange(filter.index + 1)}
          >
            »
          </button>
        </div>
      </div>
      <dialog id="my_modal_edit" className="modal">
        <div className="modal-box w-[95%] max-w-6xl">
          <form method="dialog" className="sticky top-0 z-[20]">
            <button
              className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
              ✕
            </button>
          </form>
          <div
            className="flex flex-col items-center justify-center gap-12 rounded-sm border border-stroke bg-white py-16 shadow-default dark:border-strokedark dark:bg-boxdark">
            <ul className="steps w-full">
              {itemsShow?.status &&
                getOrderStatusFromText(itemsShow.status) &&
                getRoadMap(
                  getOrderStatusFromText(itemsShow.status) as OrderStatus,
                )?.map((status, index) => {
                  let stepClass = "step step-info";
                  let dataContent = `${index}`;

                  if (status === "Completed") {
                    dataContent = "$";
                  } else if (status === "Cancelled") {
                    dataContent = "!";
                  } else if (status === "Refunded") {
                    dataContent = "?";
                  }

                  return (
                    <li
                      key={index}
                      className={stepClass}
                      data-content={dataContent}
                    >
                      {status}
                    </li>
                  );
                })}
            </ul>
            {itemsShow?.status === "Pending" && (
              <div className="h-full w-full px-4">
                <div className="mb-4 text-center text-xl font-bold">
                  Add Imei!
                </div>
                {itemsShow &&
                  itemsShow.orderProducts
                    .filter((x) => x.hasImei)
                    .map((it) => (
                      <div key={it.id} className="h-full w-full">
                        <table className="table w-full">
                          <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>Count IMEI Needed</th>
                            <th>Select IMEI</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td>{it.product.name}</td>
                            <td>{it.quantity - (it.imei?.length || 0)}</td>
                            <td>
                              <div className="dropdown">
                                <div
                                  tabIndex={0}
                                  role="button"
                                  className="btn btn-ghost"
                                >
                                  Select IMEI
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
                                  {it.productVariant.imeiList?.map((imei) => (
                                    <li
                                      key={imei}
                                      className="flex items-center gap-2"
                                    >
                                      <label className="label cursor-pointer gap-2">
                                          <span className="label-text">
                                            {imei}
                                          </span>
                                        <input
                                          type="checkbox"
                                          value={imei}
                                          checked={
                                            orderInput?.orderList
                                              .find(
                                                (n) =>
                                                  n.orderProductId ===
                                                  Number(it.id),
                                              )
                                              ?.imei.includes(imei) ?? false
                                          }
                                          onChange={(e) =>
                                            handleImeiChange(
                                              e,
                                              imei,
                                              Number(it.id),
                                            )
                                          }
                                          className="checkbox-info checkbox"
                                        />
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
              </div>
            )}
            <div className="flex gap-4">
              <button
                className="btn btn-success w-33"
                disabled={((): boolean => {
                  if (itemsShow == null) return true;
                  const status = getOrderStatusFromText(itemsShow?.status);
                  if (!status) return true;
                  const next = getNextStatus(status);
                  if (!next) return true;
                  return false;
                })()}
                onClick={async () => {
                  if (itemsShow == null) return;
                  const status = getOrderStatusFromText(itemsShow?.status);
                  if (!status) return;
                  const next = getNextStatus(status);
                  if (!next) return;
                  await handleSubmit(next, false);
                }}
              >
                Next
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
                    d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
                  />
                </svg>
              </button>
              <button
                className="btn btn-error w-33"
                disabled={((): boolean => {
                  if (itemsShow == null) return true;
                  const status = getOrderStatusFromText(itemsShow?.status);
                  if (!status) return true;
                  return (
                    status === OrderStatus.Cancelled ||
                    status === OrderStatus.Refunded ||
                    status === OrderStatus.Completed
                  );
                })()}
                onClick={async () => {
                  if (itemsShow == null) return;
                  await handleSubmit(OrderStatus.Cancelled, false);
                }}
              >
                Cancel
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
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_view" className="modal">
        <div className="modal-box w-[95%] max-w-6xl">
          <form method="dialog" className="sticky top-0 z-[20]">
            <button
              className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
              ✕
            </button>
          </form>
          <div className="mt-4">
            <div className="main-box border-gray-200 max-w-xl rounded-xl border pt-6 max-lg:mx-auto lg:max-w-full">
              <div
                className="border-gray-200 flex flex-col justify-between border-b px-6 pb-6 lg:flex-row lg:items-center">
                <div className="data">
                  <p className="text-base font-semibold leading-7 text-black dark:text-white ">
                    Order Id:{" "}
                    <span className="font-medium text-indigo-600">
                      {itemsShow && itemsShow?.orderUid}
                    </span>
                  </p>
                  <p className="mt-4 text-base font-semibold leading-7 text-black  dark:text-white">
                    Order Payment :{" "}
                    <span className="text-gray-400 font-medium">
                      {new Date(itemsShow?.created_at ?? "").toUTCString()}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-300 rounded-full border-4 px-4 py-2 text-center text-3xl font-bold">
                  {itemsShow && itemsShow.paymentInfo?.isPaid
                    ? "Paid"
                    : "UnPaid"}
                </div>
              </div>
              <div className="w-full px-3 min-[400px]:px-6">
                {itemsShow &&
                  itemsShow?.orderProducts.map((product, index) => (
                    <div
                      key={index}
                      className="border-gray-200 flex w-full flex-col items-center gap-6 border-b py-6 lg:flex-row"
                    >
                      <div className="img-box max-lg:w-full">
                        <Image
                          src={((): string => {
                            if (!product?.variantAttributes)
                              return "/no-item-found.png";
                            const colorValue = product?.variantAttributes.find(
                              (x) => x?.type?.toLowerCase() === "color",
                            )?.value;

                            const url =
                              product?.product?.details?.imgDisplay?.find((i) =>
                                i?.link?.find(
                                  (x) =>
                                    x.toLowerCase() ===
                                    colorValue?.toLowerCase(),
                                ),
                              )?.url;

                            return url
                              ? `${Backend_URL}${url}`
                              : "/no-item-found.png";
                          })()}
                          width={100}
                          height={100}
                          alt={``}
                          className="aspect-square w-full lg:max-w-[140px]"
                        />
                      </div>
                      <div className="flex w-full flex-row items-center ">
                        <div className="grid w-full grid-cols-1 lg:grid-cols-2">
                          <div className="flex items-center">
                            <div>
                              <h2 className="mb-3 text-xl font-semibold leading-8 text-black  dark:text-white">
                                {product.product.name}
                              </h2>
                              <p className="text-gray-500 mb-3 text-lg font-normal leading-8 ">
                                By: {product.product.details.brand?.value}
                              </p>
                              <div className="flex items-center ">
                                {product.variantAttributes &&
                                  product.variantAttributes.map((x) => {
                                    return (
                                      <p
                                        key={x.id}
                                        className="border-gray-200 mr-4 border-r pr-4 text-base  font-medium leading-7 text-black dark:text-white"
                                      >
                                        {x.type}:
                                        <span className="text-gray-500">
                                          {x.value}
                                        </span>
                                      </p>
                                    );
                                  })}

                                <p className="text-base font-medium leading-7 text-black dark:text-white  ">
                                  Qty:
                                  <span className="text-gray-500">
                                    {product.quantity}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-5">
                            <div className="col-span-5 flex items-center max-lg:mt-3 lg:col-span-1">
                              <div className="flex gap-3 lg:block">
                                <p className="text-sm font-medium leading-7 text-black dark:text-white ">
                                  Price
                                </p>
                                <p className="text-sm font-medium leading-7 text-indigo-600 lg:mt-4">
                                  {product.unitPrice.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-5 flex items-center max-lg:mt-3 lg:col-span-2 ">
                              <div className="flex gap-3 lg:block">
                                <p className="text-sm font-medium leading-7 text-black dark:text-white ">
                                  Status
                                </p>
                                <p
                                  className="whitespace-nowrap rounded-full bg-indigo-50 px-3 py-0.5 text-sm font-medium leading-6 text-emerald-600 lg:mt-3">
                                  {itemsShow && itemsShow.status}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-5 flex items-center max-lg:mt-3 lg:col-span-2">
                              <div className="flex gap-3 lg:block">
                                <p className="whitespace-nowrap text-sm font-medium leading-6 text-black">
                                  Expected Delivery Time
                                </p>
                                <p
                                  className="whitespace-nowrap text-base font-medium leading-7 text-emerald-500 lg:mt-3">
                                  {new Date(
                                    new Date(
                                      itemsShow?.created_at ?? "",
                                    ).setDate(
                                      new Date(
                                        itemsShow?.created_at ?? "",
                                      ).getDate() + 7,
                                    ),
                                  ).toDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div
                className="border-gray-200 flex w-full flex-col items-center justify-between border-t px-6 lg:flex-row ">
                <div className="border-gray-200 ml-2 flex flex-col items-center max-lg:border-b sm:flex-row">
                  <p className=" text-gray-900 py-3 pl-6 text-lg font-medium max-lg:text-center">
                    Payment method:{" "}
                    <span className="text-gray-500">
                      {itemsShow && itemsShow.paymentInfo.paymentType}
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <p className="py-6 text-lg font-semibold text-black  dark:text-white">
                    Shipping:{" "}
                    <span className="text-indigo-600">
                      {itemsShow &&
                        itemsShow.deliveryInfo.deliveryFee.toLocaleString(
                          "vi-VN",
                          {
                            style: "currency",
                            currency: "VND",
                          },
                        )}
                    </span>
                  </p>
                  <p className="py-6 text-lg font-semibold text-black  dark:text-white">
                    Total Price:
                    <span className="text-indigo-600">
                      {itemsShow &&
                        itemsShow.totalAmount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}

                      <span className="text-red-500 text-base">
                        {" (+10% tax)"}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_bill" className="modal">
        <div className="modal-box w-[95%] max-w-6xl">
          <form method="dialog" className="sticky top-0 z-[20]">
            <button
              className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
              ✕
            </button>
          </form>
          <div className="mt-4">
            <InvoiceCard itemsShow={itemsShow || null} />
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_history" className="modal">
        <div className="modal-box w-[95%] max-w-6xl">
          <form method="dialog" className="sticky top-0 z-[20]">
            <button
              className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
              ✕
            </button>
          </form>
          <div className="mt-4">
            <h2 className="mb-4 text-2xl font-bold">History</h2>
            <ul className="space-y-4">
              {itemsShow &&
                itemsShow.statusHistory.map((it) => {
                  return (
                    <li
                      key={it.id}
                      className="flex items-center justify-start space-x-2"
                    >
                      <div className="rounded-full bg-blue-500 p-2 text-white">
                        <i className="fas fa-user"></i>
                      </div>
                      <span className="text-gray-700">
                        <strong>
                          {it.user
                            ? `${it.user.details?.firstName} ${it.user.details?.lastName}`
                            : "System"}
                        </strong>{" "}
                        changed status <strong>{it.previousStatus}</strong> to{" "}
                        <strong>{it.newStatus}</strong>
                        {" | "}
                      </span>
                      <span className="text-gray-500 ">
                        <strong>DateTime:</strong>{" "}
                        {new Date(it.createdAt).toUTCString()}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </dialog>
    </div>
  );
};
export default SalesBox;
