"use client";
import Image from "next/image";
import { UserType } from "@/types/user";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useSession } from "next-auth/react";
import {
  makeRequestApi,
  searchUserWithOptionApi,
  updateRoleUserApi,
} from "@/lib/api";
import {
  AddListUser,
  SearchUser,
  UpdateAUser,
} from "@/app/redux/features/listUser/listUser.redux";
import { toast } from "react-toastify";
import { SearchUserDto, UpdateRoleDto } from "@/lib/dtos/user";
import { Backend_URL } from "@/lib/Constants";
import { CustomFlowbiteTheme, Datepicker } from "flowbite-react";
const customTheme: CustomFlowbiteTheme["datepicker"] = {
  root: {
    base: "relative",
    input: {
      base: "relative",
      addon: "absolute inset-y-0 left-0 flex items-center pl-2",
      field: {
        base: "block w-full p-2.5",
        input: {
          base: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          colors: {
            gray: "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-graydark dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          },
        },
      },
    },
  },
  popup: {
    root: {
      base: "absolute top-10 z-50 block pt-2",
      inline: "relative top-0 z-auto",
      inner: "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-graydark",
    },
    header: {
      base: "",
      title:
        "px-2 py-3 text-center font-semibold text-graydark dark:text-white",
      selectors: {
        base: "mb-2 flex justify-between",
        button: {
          base: "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-graydark dark:text-white dark:hover:bg-gray-600",
          prev: "",
          next: "",
          view: "",
        },
      },
    },
    view: {
      base: "p-1",
    },
    footer: {
      base: "mt-2 flex space-x-2",
      button: {
        base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-cyan-300",
        today:
          "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700",
        clear:
          "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-boxdark dark:text-white dark:hover:bg-gray-600",
      },
    },
  },
  views: {
    days: {
      header: {
        base: "mb-1 grid grid-cols-7",
        title:
          "h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400",
      },
      items: {
        base: "grid w-64 grid-cols-7",
        item: {
          base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
          selected: "bg-cyan-700 text-white hover:bg-cyan-600",
          disabled: "text-gray-500",
        },
      },
    },
    months: {
      items: {
        base: "grid w-64 grid-cols-4",
        item: {
          base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
          selected: "bg-cyan-700 text-white hover:bg-cyan-600",
          disabled: "text-gray-500",
        },
      },
    },
    years: {
      items: {
        base: "grid w-64 grid-cols-4",
        item: {
          base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
          selected: "bg-cyan-700 text-white hover:bg-cyan-600",
          disabled: "text-gray-500",
        },
      },
    },
    decades: {
      items: {
        base: "grid w-64 grid-cols-4",
        item: {
          base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
          selected: "bg-cyan-700 text-white hover:bg-cyan-600",
          disabled: "text-gray-500",
        },
      },
    },
  },
};
const StaffBox = () => {
  const [itemsShow, setItemsShow] = useState<UserType | null>(null);
  const { data: session } = useSession();
  const userList = useAppSelector((state) => state.ListUser.value);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");
  const [typeForm, setTypeForm] = useState<string>("");
  const [genderCheck, setGenderCheck] = useState<boolean[]>([
    false,
    false,
    true,
  ]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [birthday, setBirthday] = useState<Date | null>(new Date());
  const [avatar, setAvatar] = useState<string>("/images/user/user-06.png");

  const handleSearch = () => {
    dispatch(SearchUser({ value: searchValue, filter: searchFilter }));
  };

  const handleGenderBox = (index: number) => {
    setGenderCheck((prevState) => prevState.map((checked, i) => i === index));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dto: SearchUserDto = {
          index: 1,
          role: ["STAFF", "ADMIN"],
        };
        const responseData = await makeRequestApi(
          searchUserWithOptionApi,
          dto,
          session?.refresh_token,
          session?.access_token,
        );

        dispatch(AddListUser(responseData.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (session?.userId && session?.refresh_token && session?.access_token) {
      fetchData();
    }
  }, [dispatch, session]);

  const handleSubmit = async (role: string[], userId: string) => {
    const dto: UpdateRoleDto = {
      userId: userId,
      role: role,
    };
    const responseData: UserType = await makeRequestApi(
      updateRoleUserApi,
      dto,
      session?.refresh_token,
      session?.access_token,
    );
    if (responseData) {
      dispatch(UpdateAUser(responseData));
      toast.success("Update role successfully");
      const modal = document.getElementById(
        "my_modal_edit",
      ) as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
    } else {
      toast.error("Update role failed");
    }
  };

  const handleShow = (items: UserType | null, model: string, type: string) => {
    const modal = document.getElementById(model) as HTMLDialogElement | null;
    setItemsShow(items);
    if (modal) {
      modal.showModal();
      setTypeForm(type);
    }
  };

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
        <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Staff List
          </h4>
          <button
            onClick={() => handleShow(null, "my_modal_control", "CREATE")}
            aria-label="Submit"
            className="btn btn-info h-4 w-26"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Thêm
          </button>
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
                onClick={() => handleShow(user, "my_modal_view", "VIEW")}
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
              <div className="dropdown dropdown-bottom dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn  btn-success m-1"
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
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
                >
                  <li>
                    <a onClick={() => handleShow(user, "my_modal_control", "EDIT")} >Edit profile</a>
                  </li>
                  <li>
                    <a onClick={() => handleShow(user, "my_modal_edit", "EDIT")} >Edit role</a>
                  </li>
                  <li>
                    <a onClick={() => handleShow(user, "my_modal_password", "PASSWORD")}>Change password</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
        {/*control*/}
        <dialog id="my_modal_control" className="modal ">
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog" className="sticky top-0">
              <button className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
                ✕
              </button>
            </form>
            <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="text-title-lg font-bold text-black dark:text-white">
                  User Form
                </h3>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium text-black dark:text-white ">
                  Email
                </p>
                <input
                  type="email"
                  placeholder={`Email`}
                  className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              {typeForm == "CREATE" && (
                <>
                  <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                    <p className="w-32 shrink-0 font-medium text-black dark:text-white ">
                      Password
                    </p>
                    <input
                      type="password"
                      placeholder={`Password`}
                      className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                    <p className="w-32 shrink-0 font-medium text-black dark:text-white ">
                      Retype Password
                    </p>
                    <input
                      type="password"
                      placeholder={`Retype Password`}
                      className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium text-black dark:text-white ">
                  Name
                </p>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="First Name"
                  className="mb-2 w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white sm:mb-0 sm:mr-4"
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Last Name"
                  className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium text-black dark:text-white">
                  Address
                </p>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  placeholder="Address"
                  className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium text-black dark:text-white ">
                  Phone Number
                </p>
                <input
                  value={phoneNumber}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (/^[0-9]*$/.test(newValue)) {
                      setPhoneNumber(newValue);
                    }
                  }}
                  type="text"
                  placeholder="Phone number"
                  className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-4 border-b py-4 text-black dark:text-white sm:flex-row ">
                <p className="w-32 shrink-0 font-medium text-black dark:text-white ">
                  Birthday
                </p>

                <Datepicker
                  value={birthday}
                  onChange={(e) => setBirthday(e)}
                  theme={customTheme}
                ></Datepicker>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium text-black  dark:text-white">
                  Gender
                </p>
                <div className="flex items-center">
                  <input
                    type="radio"
                    className="h-5 w-5 cursor-pointer text-black dark:text-white "
                    id="Male"
                    checked={genderCheck[0]}
                    onChange={() => handleGenderBox(0)}
                    defaultChecked={genderCheck[0]}
                  />
                  <label
                    htmlFor="Male"
                    className="ml-2 flex cursor-pointer gap-2 text-black dark:text-white "
                  >
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    className="h-5 w-5 cursor-pointer text-black dark:text-white "
                    id="Female"
                    checked={genderCheck[1]}
                    onChange={() => handleGenderBox(1)}
                    defaultChecked={genderCheck[1]}
                  />
                  <label
                    htmlFor="Female"
                    className="ml-2 flex cursor-pointer gap-2 text-black dark:text-white "
                  >
                    Female
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    className="dark:bg-dark h-5 w-5 cursor-pointer text-black dark:text-white "
                    id="Other"
                    checked={genderCheck[2]}
                    onChange={() => handleGenderBox(2)}
                    defaultChecked={genderCheck[2]}
                  />
                  <label
                    htmlFor="Other"
                    className="dark:bg-dark ml-2 flex cursor-pointer gap-2 text-black dark:text-white"
                  >
                    Other
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-4 py-4  lg:flex-row">
                <div className="w-32 shrink-0  sm:py-4">
                  <p className="mb-auto font-medium text-black dark:text-white ">
                    Avatar
                  </p>
                  <p className="text-sm  text-black dark:text-white ">
                    Change your avatar
                  </p>
                </div>
                <div className="border-gray-300 flex h-56 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-5 text-center">
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-16 w-16 rounded-full"
                    loading="lazy"
                  />
                  <p className="text-sm text-black dark:text-white ">
                    Drop your desired image file here to start the upload
                  </p>
                  <input
                    title="upload"
                    type="file"
                    className="max-w-full rounded-lg px-2 font-medium text-blue-600 outline-none ring-blue-600 focus:ring-1"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                {typeForm}
              </button>
            </div>
          </div>
        </dialog>

        {/*view*/}
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
            <div className="flex">
              <p className="py-1">
                First name: {itemsShow?.details?.firstName}
              </p>
              <div className="mx-2 py-1">|</div>
              <p className="py-1">Last name: {itemsShow?.details?.lastName}</p>
            </div>
            <p className="py-1">Email: {itemsShow?.email}</p>
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

        {/*password*/}
        <dialog
          id="my_modal_password"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <form method="dialog" className="sticky top-0">
              <button className="btn btn-circle btn-error btn-md absolute right-2 top-2 rounded-full border border-stroke text-xl">
                ✕
              </button>
            </form>

            <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="text-title-lg font-bold text-black dark:text-white">
                  User Form
                </h3>
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium text-black dark:text-white ">
                  Password
                </p>
                <input
                  type="password"
                  placeholder={`Password`}
                  className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
                <p className="w-32 shrink-0 font-medium text-black dark:text-white ">
                  Retype Password
                </p>
                <input
                  type="password"
                  placeholder={`Retype Password`}
                  className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>
              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Submit
              </button>
            </div>
          </div>
        </dialog>

        {/*role*/}
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
                              !newItems.role.includes("STAFF")
                            ) {
                              newItems.role = [
                                ...(newItems.role || []),
                                "STAFF",
                              ];
                            }
                          } else {
                            newItems.role = (newItems.role || []).filter(
                              (role) => role !== "STAFF",
                            );
                          }
                          return newItems;
                        }
                        return null;
                      });
                    }}
                    type="checkbox"
                    className="toggle toggle-secondary"
                    checked={itemsShow?.role?.includes("STAFF")}
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

export default StaffBox;
