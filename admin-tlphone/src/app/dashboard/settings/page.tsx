"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react"
import Datepicker from "tailwind-datepicker-react"
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
// import { editUserDetailApi, getUserDetailApi, makeRequestApi } from "@/lib/api";
import { UserType } from "@/types/user";
// import { EditProfileDto } from "@/lib/dtos/user";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { UpdateUser } from "@/app/redux/features/user/user.redux";
import { IOptions } from "tailwind-datepicker-react/types/Options";

const options : IOptions = {
  title: "Demo Title",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: "Clear",
  // maxDate: new Date("2030-01-01"),
  // minDate: new Date("1950-01-01"),
  theme: {
    background: "bg-slate-200 dark:bg-slate-300",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "bg-red-300",
    input: "",
    inputIcon: "",
    selected: "",
  },
  icons: {
    // () => ReactElement | JSX.Element
    prev: () => <span>Previous</span>,
    next: () => <span>Next</span>,
  },
  datepickerClassNames: "top-12",
  defaultDate: new Date("2022-01-01"),
  language: "en",
  disabledDates: [],
  weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  inputNameProp: "date",
  inputIdProp: "date",
  inputPlaceholderProp: "Select Date",
  inputDateFormatProp: {
    day: "numeric",
    month: "long",
    year: "numeric"
  }
}

const Settings = () => {
  const { data: session } = useSession()
  const userDetail = useAppSelector((state) => state.UserRedux.value)
  const dispatch = useAppDispatch()
  const [show, setShow] = useState<boolean>(false);
  const [genderCheck, setGenderCheck] = useState<boolean[]>([false, false, true]);
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [birthday, setBirthday] = useState<Date | undefined>(new Date());
  const [avatar, setAvatar] = useState<string>('../image/user/user-06.png');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     let dataUser: UserType = await makeRequestApi(getUserDetailApi, null, session?.refresh_token, session?.access_token)
  //     dispatch(UpdateUser(dataUser));
  //     setUsername(dataUser.username ? dataUser.username : "")
  //     setFirstName(dataUser?.details?.firstName ? dataUser?.details?.firstName : "")
  //     setLastName(dataUser?.details?.lastName ? dataUser?.details?.lastName : "")
  //     setAddress(dataUser?.details?.address ? dataUser?.details?.address : "")
  //     setPhoneNumber(dataUser?.details?.phoneNumber ? dataUser?.details?.phoneNumber : "")
  //     setBirthday(dataUser?.details?.birthday ? new Date(dataUser?.details?.birthday) : new Date())
  //     setAvatar(dataUser?.details?.imgDisplay ? dataUser?.details?.imgDisplay : '../image/user/user-06.png')
  //     if (dataUser?.details?.gender === "MALE") {
  //       setGenderCheck([true, false, false])
  //     }
  //     else if (dataUser?.details?.gender === "FEMALE") {
  //       setGenderCheck([false, true, false])
  //     }
  //   }
  //   if (session?.userId && session?.refresh_token && session?.access_token) {
  //     fetchData();
  //   }
  // }, [session])

  const handleGenderBox = (index: number) => {
    setGenderCheck(prevState =>
      prevState.map((checked, i) => (i === index ? true : false))
    );
  };

  const handleChange = (selectedDate: Date) => {
    setBirthday(selectedDate);
  };

  const handleClose = (state: boolean) => {
    setShow(state);
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

  // const handleSave = async () => {
  //   let tmpGender = genderCheck[0] ? "MALE" : genderCheck[1] ? "FEMALE" : "OTHER";
  //   let dto: EditProfileDto = {
  //     username: username,
  //     firstName: firstName,
  //     lastName: lastName,
  //     address: address,
  //     phoneNumber: phoneNumber,
  //     birthday: birthday,
  //     imgDisplay: avatar,
  //     gender: tmpGender
  //   }
  //   let dataUser: UserType = await makeRequestApi(editUserDetailApi, dto, session?.expires, session?.access_token)
  //   if (dataUser) {
  //     dispatch(UpdateUser(dataUser))
  //     toast.success("Update successful!!");
  //   }
  //   else {
  //     toast.error("Update failed!!");
  //   }
  // }
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-1 gap-8">
          <div className="my-4 max-w-screen-md border px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4 md:mx-auto ">
            <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
              <div className="shrink-0 mr-auto sm:py-3">
                <p className="font-medium text-black dark:text-white ">Account Details</p>
                <p className="text-sm text-black dark:text-white ">Edit your account details</p>
              </div>
              <button className=" text-black dark:text-white  mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 sm:inline focus:outline-none focus:ring hover:bg-gray-200">
                Cancel
              </button>
              {/*<button onClick={handleSave} className="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-black dark:text-white  sm:inline focus:outline-none focus:ring hover:bg-blue-700">*/}
              {/*  Save*/}
              {/*</button>*/}
            </div>
            <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
              <p className="shrink-0 w-32 font-medium text-black dark:text-white ">Email</p>
              <input
                disabled
                type="email"
                placeholder={`${userDetail?.email}`}
                className="w-full rounded-md border text-black dark:text-white border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-2 py-2 outline-none ring-blue-600 focus:ring-1"
              />
            </div>
            <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
              <p className="shrink-0 w-32 font-medium text-black dark:text-white ">Username</p>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                className="w-full rounded-md border text-black dark:text-white border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-2 py-2 outline-none ring-blue-600 focus:ring-1"
              />
            </div>
            <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
              <p className="shrink-0 w-32 font-medium text-black dark:text-white ">Name</p>
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                type="text"
                placeholder="First Name"
                className="mb-2 w-full rounded-md border text-black dark:text-white border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-2 py-2 outline-none ring-blue-600 sm:mr-4 sm:mb-0 focus:ring-1"
              />
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                type="text"
                placeholder="Last Name"
                className="w-full rounded-md border text-black dark:text-white border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-2 py-2 outline-none ring-blue-600 focus:ring-1"
              />
            </div>
            <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
              <p className="shrink-0 w-32 text-black dark:text-white font-medium">Address</p>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                type="text"
                placeholder="Address"
                className="w-full rounded-md border text-black dark:text-white border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-2 py-2 outline-none ring-blue-600 focus:ring-1"
              />
            </div>
            <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
              <p className="shrink-0 w-32 font-medium text-black dark:text-white ">Phone Number</p>
              <input
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                type="text"
                placeholder="Phone number"
                className="w-full rounded-md border text-black dark:text-white border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-2 py-2 outline-none ring-blue-600 focus:ring-1"
              />
            </div>
            <div className="flex flex-col gap-4 border-b py-4 sm:flex-row text-black dark:text-white ">
              <p className="shrink-0 w-32 font-medium text-black dark:text-white ">Birthday</p>
              <Datepicker value={birthday} options={options} onChange={handleChange} show={show} setShow={handleClose} />
            </div>
            <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
              <p className="shrink-0 w-32 text-black dark:text-white  font-medium">Gender</p>
              <div className="flex items-center">
                <input
                  type="radio"
                  className="w-5 h-5 cursor-pointer text-black dark:text-white "
                  id="Male"
                  checked={genderCheck[0]}
                  onChange={() => handleGenderBox(0)}
                  defaultChecked={genderCheck[0]}
                />
                <label
                  htmlFor="Male"
                  className="ml-2 flex gap-2 cursor-pointer text-black dark:text-white "
                >
                  Male
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  className="w-5 h-5 cursor-pointer text-black dark:text-white "
                  id="Female"
                  checked={genderCheck[1]}
                  onChange={() => handleGenderBox(1)}
                  defaultChecked={genderCheck[1]}
                />
                <label
                  htmlFor="Female"
                  className="ml-2 flex gap-2 cursor-pointer text-black dark:text-white "
                >
                  Female
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  className="w-5 h-5 cursor-pointer text-black dark:text-white "
                  id="Other"
                  checked={genderCheck[2]}
                  onChange={() => handleGenderBox(2)}
                  defaultChecked={genderCheck[2]}
                />
                <label
                  htmlFor="Other"
                  className="ml-2 flex gap-2 cursor-pointer text-black dark:text-white "
                >
                  Other
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-4 py-4  lg:flex-row">
              <div className="shrink-0 w-32  sm:py-4">
                <p className="mb-auto font-medium text-black dark:text-white ">Avatar</p>
                <p className="text-sm  text-black dark:text-white ">Change your avatar</p>
              </div>
              <div className="flex h-56 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 p-5 text-center">
                <img src={avatar} alt="Avatar" className="h-16 w-16 rounded-full" loading="lazy" />
                <p className="text-sm text-black dark:text-white ">Drop your desired image file here to start the upload</p>
                <input
                  title="upload"
                  type="file"
                  className="max-w-full rounded-lg px-2 font-medium text-blue-600 outline-none ring-blue-600 focus:ring-1"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <div className="flex justify-end py-4 sm:hidden">
              <button className="mr-2 rounded-lg border-2 px-4 py-2 font-medium focus:outline-none focus:ring hover:bg-gray-200 text-black dark:text-white ">
                Cancel
              </button>
              {/*<button onClick={handleSave} className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-black dark:text-white  focus:outline-none focus:ring hover:bg-blue-700">*/}
              {/*  Save*/}
              {/*</button>*/}
            </div>
          </div>

        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
