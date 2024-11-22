"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import { getUserByIdApi, makeRequestApi, updateUserProfileApi } from "@/lib/api";
import { UserType } from "@/types/user";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { UpdateUser } from "@/app/redux/features/user/user.redux";
import { CustomFlowbiteTheme, Datepicker } from "flowbite-react";
import { UpdateProfileDto } from "@/lib/dtos/user";

const customTheme : CustomFlowbiteTheme["datepicker"] =  {
  "root": {
    "base": "relative",
    "input": {
      "base": "relative",
      "addon": "absolute inset-y-0 left-0 flex items-center pl-2",
      "field": {
        "base": "block w-full p-2.5",
        "input": {
          "base": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          "colors": {
            "gray": "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-graydark dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          }
        }
      }
    }

  },
  "popup": {
    "root": {
      "base": "absolute top-10 z-50 block pt-2",
      "inline": "relative top-0 z-auto",
      "inner": "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-graydark"
    },
    "header": {
      "base": "",
      "title": "px-2 py-3 text-center font-semibold text-graydark dark:text-white",
      "selectors": {
        "base": "mb-2 flex justify-between",
        "button": {
          "base": "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-graydark dark:text-white dark:hover:bg-gray-600",
          "prev": "",
          "next": "",
          "view": ""
        }
      }
    },
    "view": {
      "base": "p-1"
    },
    "footer": {
      "base": "mt-2 flex space-x-2",
      "button": {
        "base": "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-cyan-300",
        "today": "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700",
        "clear": "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-boxdark dark:text-white dark:hover:bg-gray-600"
      }
    }
  },
  "views": {
    "days": {
      "header": {
        "base": "mb-1 grid grid-cols-7",
        "title": "h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400"
      },
      "items": {
        "base": "grid w-64 grid-cols-7",
        "item": {
          "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
          "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
          "disabled": "text-gray-500"
        }
      }
    },
    "months": {
      "items": {
        "base": "grid w-64 grid-cols-4",
        "item": {
          "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
          "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
          "disabled": "text-gray-500"
        }
      }
    },
    "years": {
      "items": {
        "base": "grid w-64 grid-cols-4",
        "item": {
          "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
          "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
          "disabled": "text-gray-500"
        }
      }
    },
    "decades": {
      "items": {
        "base": "grid w-64 grid-cols-4",
        "item": {
          "base": "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
          "selected": "bg-cyan-700 text-white hover:bg-cyan-600",
          "disabled": "text-gray-500"
        }
      }
    }
  }
}
const Settings = () => {
  const { data: session } = useSession()
  const userDetail = useAppSelector((state) => state.UserRedux.value)
  const dispatch = useAppDispatch()
  const [show, setShow] = useState<boolean>(false);
  const [genderCheck, setGenderCheck] = useState<boolean[]>([false, false, true]);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [birthday, setBirthday] = useState<Date | null>(new Date());
  const [avatar, setAvatar] = useState<string>('../image/user/user-06.png');

  useEffect(() => {
    const fetchData = async () => {
      let dataUser: UserType = await makeRequestApi(getUserByIdApi, session?.userId, session?.refresh_token, session?.access_token)
      dispatch(UpdateUser(dataUser));
      setFirstName(dataUser?.details?.firstName ? dataUser?.details?.firstName : "")
      setLastName(dataUser?.details?.lastName ? dataUser?.details?.lastName : "")
      setAddress(dataUser?.details?.address ? dataUser?.details?.address : "")
      setPhoneNumber(dataUser?.details?.phoneNumber ? dataUser?.details?.phoneNumber : "")
      setBirthday(dataUser?.details?.birthday ? new Date(dataUser?.details?.birthday) : new Date())
      setAvatar(dataUser?.details?.imgDisplay ? dataUser?.details?.imgDisplay : '../image/user/user-06.png')
      if (dataUser?.details?.gender === "MALE") {
        setGenderCheck([true, false, false])
      }
      else if (dataUser?.details?.gender === "FEMALE") {
        setGenderCheck([false, true, false])
      }
    }
    if (session?.userId && session?.refresh_token && session?.access_token) {
      fetchData();
    }
  }, [session])

  const handleGenderBox = (index: number) => {
    setGenderCheck(prevState =>
      prevState.map((checked, i) => (i === index))
    );
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

  const handleSave = async () => {
    let tmpGender = genderCheck[0] ? "MALE" : genderCheck[1] ? "FEMALE" : "OTHER";
    let dto: UpdateProfileDto = {
      firstName: firstName,
      lastName: lastName,
      address: address,
      phoneNumber: phoneNumber,
      birthday: birthday,
      imgDisplay: avatar,
      gender: tmpGender
    }
    let dataUser: UserType = await makeRequestApi(updateUserProfileApi, dto, session?.expires, session?.access_token)
    if (dataUser) {
      dispatch(UpdateUser(dataUser))
      toast.success("Update successful!!");
    }
    else {
      toast.error("Update failed!!");
    }
  }
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-1 gap-8">
          <div className="my-4 max-w-screen-md border px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4 md:mx-auto ">
            <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
              <div className="mr-auto shrink-0 sm:py-3">
                <p className="font-medium text-black dark:text-white ">
                  Account Details
                </p>
                <p className="text-sm text-black dark:text-white ">
                  Edit your account details
                </p>
              </div>
              <button className=" text-gray-500 hover:bg-gray-200  mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-black focus:outline-none focus:ring dark:text-white sm:inline">
                Cancel
              </button>
              <button onClick={handleSave} className="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-black dark:text-white  sm:inline focus:outline-none focus:ring hover:bg-blue-700">
                Save
              </button>
            </div>
            <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
              <p className="w-32 shrink-0 font-medium text-black dark:text-white ">
                Email
              </p>
              <input
                disabled
                type="email"
                placeholder={`${userDetail?.email}`}
                className="w-full rounded-md border border-stroke bg-white px-2 py-2 text-black shadow-default outline-none ring-blue-600 focus:ring-1 dark:border-strokedark dark:bg-boxdark dark:text-white"
              />
            </div>

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

            <Datepicker value={birthday} onChange={e => setBirthday(e)} theme={customTheme}></Datepicker>
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
                  className="h-5 w-5 cursor-pointer text-black dark:text-white dark:bg-dark "
                  id="Other"
                  checked={genderCheck[2]}
                  onChange={() => handleGenderBox(2)}
                  defaultChecked={genderCheck[2]}
                />
                <label
                  htmlFor="Other"
                  className="ml-2 flex cursor-pointer gap-2 text-black dark:text-white dark:bg-dark"
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
            <div className="flex justify-end py-4 sm:hidden">
              <button className="hover:bg-gray-200 mr-2 rounded-lg border-2 px-4 py-2 font-medium text-black focus:outline-none focus:ring dark:text-white ">
                Cancel
              </button>
              <button onClick={handleSave} className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-black dark:text-white  focus:outline-none focus:ring hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
