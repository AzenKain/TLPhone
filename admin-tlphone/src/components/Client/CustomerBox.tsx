'use client'
import Image from "next/image";
import { UserType } from "@/types/user";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useSession } from "next-auth/react";
import { makeRequestApi, searchUserWithOptionApi, updateRoleUserApi } from "@/lib/api";
import { AddListUser, SearchUser, UpdateAUser } from "@/app/redux/features/listUser/listUser.redux";
import { toast } from "react-toastify";
import { SearchUserDto, UpdateRoleDto } from "@/lib/dtos/user";
import { Backend_URL } from "@/lib/Constants";


const CustomerBox = () => {
  const [itemsShow, setItemsShow] = useState<UserType | null>(null)
  const { data: session } = useSession()
  const userList = useAppSelector((state) => state.ListUser.value)
  const dispatch = useAppDispatch()
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

  const handleSearch = () => {
    dispatch(SearchUser({value: searchValue, filter: searchFilter}))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dto : SearchUserDto = {
          index : 1,
          role: ["USER"]
        }
        const responseData  = await makeRequestApi(searchUserWithOptionApi, dto, session?.refresh_token, session?.access_token);

        dispatch(AddListUser(responseData.data))

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (session?.userId && session?.refresh_token && session?.access_token) {
      fetchData();
    }
  }, [dispatch, session])

  const handleSubmit = async (role: string[], userId: string) => {
    if (role.length == 0 || userId == "") {
      return;
    }
    const dto: UpdateRoleDto = {
      userId: userId,
      role: role
    }
    const responseData: UserType = await makeRequestApi(updateRoleUserApi, dto, session?.refresh_token, session?.access_token);
    if (responseData) {
      dispatch(UpdateAUser(responseData))
      toast.success("Update role successfully")
      const modal = document.getElementById("my_modal_edit") as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
    }
    else {
      toast.error("Update role failed")
    }
  }

  const handleShow = (items: UserType, model: string) => {
    const modal = document.getElementById(model) as HTMLDialogElement | null;
    setItemsShow(items)
    if (modal) {
      modal.showModal();
    }
  }



  return (
    <div className="mt-2 flex flex-col gap-10">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex w-full">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search for the tool you like"
            className="h-10 w-full rounded-l  border-2 border-stroke bg-white px-3 text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white"
          />
          <button
            onClick={() => handleSearch()}
            type="submit"
            className="rounded-r bg-sky-500 px-2 py-0 text-black dark:text-white md:px-3 md:py-1"
          >
            Search
          </button>
        </div>
        <select
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          id="pricingType"
          name="pricingType"
          className="h-10 rounded border-2 border-stroke bg-white px-2 py-0 tracking-wider text-black shadow-default dark:border-strokedark dark:bg-boxdark dark:text-white md:px-3 md:py-1"
        >
          <option value="all">All</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="phoneNumber">Phone Number</option>
          <option value="email">Email</option>
        </select>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Customer List
          </h4>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">User name</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="font-medium">Role</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Gender</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">City</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Phone number</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Controller</p>
          </div>
        </div>

        {userList?.map((user, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-12.5 w-15 rounded-md">
                  <Image
                    src={
                      user?.details?.imgDisplay
                        ? Backend_URL + user?.details?.imgDisplay
                        : "/images/user/user-06.png"
                    }
                    width={60}
                    height={50}
                    alt="Product"
                  />
                </div>
                <p className="text-sm text-black dark:text-white">
                  {`${user?.details?.firstName} ${user?.details?.lastName}`}
                </p>
              </div>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {user?.role.join(", ")}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {user?.details?.gender}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {user?.details?.address}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-meta-3">
                {user?.details?.phoneNumber}
              </p>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <button
                aria-label="Submit"
                onClick={() => handleShow(user, "my_modal_view")}
                className="btn btn-info"
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
                    d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </button>

              <button
                aria-label="Submit"
                onClick={() => handleShow(user, "my_modal_edit")}
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

        <dialog
          id="my_modal_view"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <Image
              src={
                itemsShow?.details?.imgDisplay
                  ? Backend_URL + itemsShow?.details?.imgDisplay
                  : "/images/user/user-06.png"
              }
              width={100}
              height={100}
              alt="user"
            />
            <p className="py-1">Email: {itemsShow?.email}</p>
            <div className="flex">
              <p className="py-1">
                First name: {itemsShow?.details?.firstName}
              </p>
              <div className="mx-2">|</div>
              <p className="py-1">Last name: {itemsShow?.details?.lastName}</p>
            </div>
            <p className="py-1">Gender: {itemsShow?.details?.gender}</p>
            <p className="pb-1">
              Birthday:{" "}
              {new Date(itemsShow?.details?.birthday ?? "").toDateString()}
            </p>
            <p className="pb-1">
              Phone number: {itemsShow?.details?.phoneNumber}
            </p>
            <p className="pb-1">Address: {itemsShow?.details?.address}</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>

        <dialog
          id="my_modal_edit"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-lg absolute right-2 top-2 text-3xl">
                ✕
              </button>
            </form>
            <div className="flex flex-col">
              <h3 className="text-3xl font-semibold">List Roles</h3>
              <div className="form-control w-65">
                <label className="label cursor-pointer">
                  <span className="label-text">ADMIN</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={itemsShow?.role?.includes("ADMIN")}
                  />
                </label>
              </div>
              <div className="form-control w-65">
                <label className="label cursor-pointer">
                  <span className="label-text">ACTIVE</span>
                  <input
                    onChange={(e) => {
                      setItemsShow((prevItems) => {
                        if (prevItems) {
                          const newItems = { ...prevItems };
                          if (e.target.checked) {
                            if (
                              !newItems.role ||
                              !newItems.role.includes("USER")
                            ) {
                              newItems.role = [
                                ...(newItems.role || []),
                                "USER",
                              ];
                            }
                          } else {
                            newItems.role = (newItems.role || []).filter(
                              (role) => role !== "USER",
                            );
                          }
                          return newItems;
                        }
                        return null;
                      });
                    }}
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={itemsShow?.role?.includes("USER")}
                  />
                </label>
              </div>
              <div className="form-control w-65">
                <label className="label cursor-pointer">
                  <span className="label-text">INACTIVE</span>
                  <input
                    onChange={(e) => {
                      setItemsShow((prevItems) => {
                        if (prevItems) {
                          const newItems = { ...prevItems };
                          if (e.target.checked) {
                            if (
                              !newItems.role ||
                              !newItems.role.includes("INACTIVE")
                            ) {
                              newItems.role = [
                                ...(newItems.role || []),
                                "INACTIVE",
                              ];
                            }
                          } else {
                            newItems.role = (newItems.role || []).filter(
                              (role) => role !== "INACTIVE",
                            );
                          }
                          return newItems;
                        }
                        return null;
                      });
                    }}
                    type="checkbox"
                    className="toggle toggle-error"
                    checked={itemsShow?.role?.includes("INACTIVE")}
                  />
                </label>
              </div>
              <button
                onClick={async () =>
                  await handleSubmit(
                    itemsShow?.role ?? [],
                    itemsShow?.secretKey ?? "",
                  )
                }
                className="btn btn-success"
              >
                Submit
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default CustomerBox;