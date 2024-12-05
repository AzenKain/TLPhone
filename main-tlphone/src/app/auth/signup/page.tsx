"use client"
import React, { ChangeEvent, useRef, useState } from "react";
import { signUpApi } from "@/lib/api";
import { CreateOtpDto, SignUpDto, VerifyOtpDto } from "@/lib/dtos/auth";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import Link from 'next/link'

const SignUp: React.FC<{ searchParams: { callbackUrl?: string } }> = ({ searchParams }) => {
    const router = useRouter()
    const [emailUser, setEmailUser] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [passwordUser, setPasswordUser] = useState("");
    const [rePasswordUser, setRePasswordUser] = useState("");
    const [gender, setGender] = useState<boolean[]>([false, false, true]);
    const callbackUrl = React.useMemo(() => searchParams?.callbackUrl, [searchParams])

    const handleGenderBox = (index: number) => {
        setGender(prevState =>
            prevState.map((checked, i) => (i === index))
        );
    };

    const handleSignIn = async () => {
        if (firstName == "") {
            toast.error("You must enter your first name!")
            return
        }
        if (lastName == "") {
            toast.error("You must enter your last name!")
            return
        }
        if (emailUser == "") {
            toast.error("You must enter your email!")
            return
        }
        if (passwordUser == "") {
            toast.error("You must enter your password!")
            return
        }
        if (rePasswordUser == "") {
            toast.error("You must enter your re-type password!")
            return
        }
        if (phoneNumber == "") {
            toast.error("You must enter your username!")
            return
        }
        if (passwordUser != rePasswordUser) {
            toast.error("Your password is not the same your re-type password!")
            return
        }
        let tmpGender = gender[0] ? "MALE" : gender[1] ? "FEMALE" : "OTHER";
        const loginDto: SignUpDto = {
            email: emailUser,
            password: passwordUser,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            gender: tmpGender
        }


        const dataRe = await signUpApi(loginDto);
        if (dataRe == null) {
            toast.error("SignUp failed!")
            return
        }
        else {
            const res = await signIn("credentials", {
                email: emailUser, password: passwordUser, redirect: false,
            });

            if (!res?.error) {
                router.push(callbackUrl ?? "/");
                toast.success("SignUp successful!")
            }
            else {
                toast.error("SignUp failed!")
            }
        }
    }

    return (
        <div>
            <div className="bg-white dark:bg-gray-900 mx-10 my-2">
                <div className="flex justify-center h-screen">
                    <div
                        className="hidden bg-cover lg:block lg:w-7/12"
                        style={{
                            backgroundImage:
                                "url(https://d30wkz0ptv5pwh.cloudfront.net/media/magefan_blog/mobile_phone.jpg)"
                        }}
                    >
                        <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                            <div>
                                <h2 className="text-4xl font-bold text-white">TLPhone</h2>
                                <p className="max-w-xl mt-3 text-gray-300">
                                    Lựa chọn hàng đầu của bạn!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center w-full px-6 mx-auto lg:w-5/12">
                        <div className="flex-1">
                            <div className="text-center">
                                <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
                                    TLPhone
                                </h2>
                                <p className="mt-3 text-gray-500 dark:text-gray-300">
                                    Sign up to create your account
                                </p>
                            </div>
                            <div className="mt-8">
                                <div className="mt-6 flex justify-between gap-4">
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="firstName"
                                            className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            placeholder="Enter your first name"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="lastName"
                                            className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            placeholder="Enter your last name"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={emailUser}
                                            onChange={e => setEmailUser(e.target.value)}
                                            placeholder="example@example.com"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <div className="flex justify-between mb-2">
                                            <label
                                                htmlFor="password"
                                                className="text-sm text-gray-600 dark:text-gray-200"
                                            >
                                                Password
                                            </label>
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={passwordUser}
                                            onChange={e => setPasswordUser(e.target.value)}
                                            placeholder="Your Password"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <div className="flex justify-between mb-2">
                                            <label
                                                htmlFor="Re-type password"
                                                className="text-sm text-gray-600 dark:text-gray-200"
                                            >
                                                Re-type Password
                                            </label>
                                        </div>
                                        <input
                                            type="password"
                                            name="Re-type password"
                                            id="Re-type password"
                                            value={rePasswordUser}
                                            onChange={e => setRePasswordUser(e.target.value)}
                                            placeholder="Re-type y Password"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <div className="flex justify-between mb-2">
                                            <label
                                                htmlFor="Phone Number"
                                                className="text-sm text-gray-600 dark:text-gray-200"
                                            >
                                                Phone Number
                                            </label>
                                        </div>
                                        <input
                                            type="password"
                                            name="Phone Number"
                                            id="Phone Number"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (/^[0-9]*$/.test(newValue)) {
                                                    setPhoneNumber(newValue);
                                                }
                                            }}
                                            placeholder="Phone Number"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <div className="flex justify-between mb-2">
                                            <label
                                                className="text-sm text-gray-600 dark:text-gray-200"
                                            >
                                                Gender
                                            </label>
                                        </div>
                                        <div className="flex flex-row gap-3">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    className="h-5 w-5 cursor-pointer text-black dark:text-white "
                                                    id="Male"
                                                    checked={gender[0]}
                                                    onChange={() => handleGenderBox(0)}
                                                    defaultChecked={gender[0]}
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
                                                    checked={gender[1]}
                                                    onChange={() => handleGenderBox(1)}
                                                    defaultChecked={gender[1]}
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
                                                    className="h-5 w-5 cursor-pointer text-black dark:text-white "
                                                    id="Other"
                                                    checked={gender[2]}
                                                    onChange={() => handleGenderBox(2)}
                                                    defaultChecked={gender[2]}
                                                />
                                                <label
                                                    htmlFor="Other"
                                                    className="ml-2 flex cursor-pointer gap-2 text-black dark:text-white "
                                                >
                                                    Other
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <button
                                            onClick={async () => handleSignIn()}
                                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                            Sign up
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-6 text-sm text-center text-gray-400">
                                    You have an account!{" "}
                                    <Link
                                        href="/auth/signin"
                                        className="text-blue-500 focus:outline-none focus:underline hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp