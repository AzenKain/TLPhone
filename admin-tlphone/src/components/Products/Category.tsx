"use client"
import Image from "next/image";
import { ItemSchemaProductDetailType, SchemaProductDetailType, SchemaProductType } from "@/types";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  AddACategory,
  AddADetail,
  AddListCategory, AddListDetail, RemoveACategory,
  RemoveADetail,
  SearchCategory
} from "@/app/redux/features/category/category.redux";
import InputAdd  from "@/components/Input/InputAdd";
import { toast } from "react-toastify";
import { SearchUserDto } from "@/lib/dtos/user";
import {
  createSchemaProductApi, deleteSchemaProductApi,
  getAllSchemaProductApi,
  makeRequestApi,
  searchUserWithOptionApi,
  updateSchemaProductApi
} from "@/lib/api";
import { CreateSchemaProductDto, DeleteSchemaProductDto, UpdateSchemaProductDto } from "@/lib/dtos/schema";

const CategoryBox = () => {
  const [itemsShow, setItemsShow] = useState<SchemaProductType | null>(null);
  const { data: session } = useSession();
  const categoryList = useAppSelector((state) => state.CategoryRedux.value);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");
  const [typeForm, setTypeForm] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [newDetailTitle, setNewDetailTitle] = useState<string>("");
  const details = useAppSelector((state) => state.CategoryRedux.detailsInput);

  const handleAddDetail = (detail: SchemaProductDetailType) => {
    dispatch(AddADetail(detail));
  };

  const handleRemoveDetail = (detail: SchemaProductDetailType) => {
    dispatch(RemoveADetail(detail));
  };

  const  handleSubmitControl = async (model: string) => {
    if (name == "") {
      toast.error("Name is required!")
      return;
    }
    if (category == "") {
      toast.error("Type category is required!")
      return
    }
    if (typeForm == "EDIT") {

      if (!itemsShow) {
        toast.error("Item select is required!")
        return;
      }
      const dto: UpdateSchemaProductDto = {
        schemaId: Number(itemsShow?.id),
        name: name,
        category: category,
        detail: details.map((item) => {
          return {
            title: item.title,
            attributes: item.attributes?.map((attr) => ({
              isUseForSearch: attr.isUseForSearch,
              value: attr.value,
            })),
          };
        }),
      };
      const responseData = await makeRequestApi(
        updateSchemaProductApi,
        dto,
        session?.refresh_token,
        session?.access_token,
      );
      if (!responseData) {
        toast.error("Failed to update schema product!")
        return
      }
      dispatch(AddACategory(responseData));
      toast.success("Update schema product successfully!")
    }
    else if (typeForm == "CREATE") {
      const dto: CreateSchemaProductDto = {
        name: name,
        category: category,
        detail: details.map((item) => {
          return {
            title: item.title,
            attributes: item.attributes?.map((attr) => ({
              isUseForSearch: attr.isUseForSearch,
              value: attr.value,
            })),
          };
        }),
      };
      const responseData = await makeRequestApi(
        createSchemaProductApi,
        dto,
        session?.refresh_token,
        session?.access_token,
      );
      if (!responseData) {
        toast.error("Failed to create schema product!")
        return
      }
      dispatch(AddACategory(responseData));
      toast.success("Create schema product successfully!")
    }
    const modal = document.getElementById(model) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const handleAttributeChange = (detailId: string, updatedAttributes: ItemSchemaProductDetailType[]) => {
    const updatedDetail = details.find(detail => detail.id === detailId);
    if (updatedDetail) {
      const updatedDetailWithAttributes = {
        ...updatedDetail,
        attributes: updatedAttributes,
      };
      handleAddDetail(updatedDetailWithAttributes);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await makeRequestApi(
          getAllSchemaProductApi,
          null,
          session?.refresh_token,
          session?.access_token,
        );
        dispatch(AddListCategory(responseData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch])

  const handleSearch = () => {
    dispatch(SearchCategory({ value: searchValue, filter: searchFilter }));
  };

  const handleInitEdit = (items: SchemaProductType | null) => {
    dispatch(AddListDetail(items?.detail ?? [] as SchemaProductDetailType[]));
    setCategory(items?.category ?? "");
    setName(items?.name ?? "");
  };

  const handleInitCreate = () => {
    dispatch(AddListDetail([] as SchemaProductDetailType[]));
    setCategory("");
    setName("");
  };

  const handleShow = (items: SchemaProductType | null, model: string, type: string) => {
    const modal = document.getElementById(model) as HTMLDialogElement | null;
    setItemsShow(items);

    if (type === "EDIT") {
      handleInitEdit(items);
    } else if (type === "CREATE") {
      handleInitCreate();
    }

    if (modal) {
      modal.showModal();
      setTypeForm(type);
    }
  };

  const handleDeleteProduct = async (model: string)=> {
    const dto: DeleteSchemaProductDto = {
      schemaId: Number(itemsShow?.id) || -1
    };
    const responseData = await makeRequestApi(
      deleteSchemaProductApi,
      dto,
      session?.refresh_token,
      session?.access_token,
    );
    if (!responseData) {
      toast.error("Failed to remove schema product")
      return
    }
    dispatch(RemoveACategory(itemsShow?.id || ""));
    toast.success("Remove schema product successfully")
    const modal = document.getElementById(model) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
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
          <option value="name">Name</option>
          <option value="category">Category</option>
        </select>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

        <div className="flex justify-between items-center px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Category List
          </h4>
          <button onClick={() => handleShow(null, "my_modal_control", "CREATE")} aria-label="Submit"
                  className="btn btn-info w-26 h-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Thêm
          </button>
        </div>

        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-3 flex items-center">
            <p className="font-medium">Name</p>
          </div>
          <div className="col-span-3 hidden items-center sm:flex">
            <p className="font-medium">Category</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Controller</p>
          </div>
        </div>

        {categoryList.map((category, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-black dark:text-white">
                  {category?.name}
                </p>
              </div>
            </div>
            <div className="col-span-3 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {category?.category}
              </p>
            </div>

            <div className="col-span-2 flex items-center gap-1">
              <button aria-label="Submit" onClick={() => handleShow(category, "my_modal_view", "VIEW")}
                      className="btn btn-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
                </svg>

              </button>

              <button aria-label="Submit" onClick={() => handleShow(category, "my_modal_control", "EDIT")}
                      className="btn btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>

              <button aria-label="Submit" onClick={() => handleShow(category, "my_modal_delete", "DELETE")}
                      className="btn btn-error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <dialog id="my_modal_view" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog" className="sticky top-0">
              <button
                className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
                ✕
              </button>
            </form>
            <div className="mt-4">
              {itemsShow ? (
                itemsShow.detail.map((detail) => (
                  <div key={detail.id} className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">{detail.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      {detail.attributes.map((attribute) => (
                        <span
                          key={attribute.id}
                          className="badge badge-primary badge-outline text-sm px-3 py-1">
                      {attribute.value}
                    </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No data available.</p>
              )}
            </div>
          </div>
        </dialog>
        <dialog id="my_modal_control" className="modal">
          <div className="modal-box w-11/12 max-w-5xl min-h-[75vh]">
            <form method="dialog" className="sticky top-0 z-[2]">
              <button
                className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
                ✕
              </button>
            </form>
            <div
              className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="text-title-lg font-bold text-black dark:text-white">
                  Category Form
                </h3>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium text-black dark:text-white">
                  Name
                </p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                  placeholder="Name category"
                  className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium text-black dark:text-white">
                  Type category
                </p>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  type="text"
                  required
                  placeholder="Type category"
                  className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>

              {details.map((detail, index) => (
                <div key={index} className="flex flex-col gap-4 border-b py-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-black dark:text-white">
                      {detail.title}
                    </h4>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleRemoveDetail(detail)}
                    >
                      Remove Detail
                    </button>
                  </div>

                  <InputAdd
                    items={detail.attributes}
                    onAdd={(newAttribute: ItemSchemaProductDetailType) => {
                      const updatedAttributes = [...detail.attributes, newAttribute];
                      handleAttributeChange(detail.id, updatedAttributes);
                    }}
                    onRemove={(removedAttribute: ItemSchemaProductDetailType) => {
                      const updatedAttributes = detail.attributes.filter(attr => attr.id !== removedAttribute.id);
                      handleAttributeChange(detail.id, updatedAttributes);
                    }}
                    onToggleUseForSearch={(itemId: string) => {
                      const updatedAttributes = detail.attributes.map(attr =>
                        attr.id === itemId ? { ...attr, isUseForSearch: !attr.isUseForSearch } : attr
                      );
                      handleAttributeChange(detail.id, updatedAttributes);
                    }}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-4 border-b py-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={newDetailTitle}
                    onChange={(e) => setNewDetailTitle(e.target.value)}
                    placeholder="Enter new detail title"
                    className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                  />
                  <button
                    onClick={() => {
                      if (newDetailTitle === "") return
                      handleAddDetail({
                        id: `${Date.now()}`, // Use current timestamp for a unique ID
                        title: newDetailTitle,
                        attributes: [],
                      } as SchemaProductDetailType);
                      setNewDetailTitle(''); // Reset the input field after adding
                    }}
                    className="ml-4 btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>
              <button
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                onClick={async () => {
                  await handleSubmitControl("my_modal_control")
                }}
              >
                {typeForm}
              </button>
            </div>
          </div>
        </dialog>
        <dialog id="my_modal_delete" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <p className="py-1 text-3xl text-rose-500">Do you want to remove this product?</p>

            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
              <button onClick={async () => await handleDeleteProduct("my_modal_delete")} className="btn btn-error">Delete</button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}

export default CategoryBox