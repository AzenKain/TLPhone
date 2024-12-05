"use client"
import React, { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import Link from 'next/link'

const SignIn: React.FC<{ searchParams: { callbackUrl?: string } }> = ({ searchParams }) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const callbackUrl = React.useMemo(() => searchParams?.callbackUrl, [searchParams]);

    const onSubmit = async () => {
        if (email === "") {
            toast.error("You must enter your email!");
            return;
        }
        if (password === "") {
            toast.error("You must enter your password!");
            return;
        }
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!res?.error) {
            router.push(callbackUrl || "/");
            toast.success("Welcome back!!");
        } else {
            toast.error("Check your email or password!");
        }
    };
    return (
        <div>
            <div className="bg-white dark:bg-gray-900 mx-10 my-2">
                <div className="flex justify-center h-screen">
                    <div
                        className="hidden bg-cover lg:block lg:w-7/12"
                        style={{
                            backgroundImage:
                                "url(https://www.go-globe.com/wp-content/uploads/2024/07/athletic-woman-using-her-smartphone.webp)"
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
                                    Sign in to access your account
                                </p>
                            </div>
                            <div className="mt-8">
                                <div>
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
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
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
                                            <a
                                                href="#"
                                                className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline"
                                            >
                                                Forgot password?
                                            </a>
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Your Password"
                                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <button
                                            onClick={async () => onSubmit()}
                                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                            Sign in
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-6 text-sm text-center text-gray-400">
                                    Don&#39;t have an account yet?{" "}
                                    <Link
                                        href="/auth/signup"
                                        className="text-blue-500 focus:outline-none focus:underline hover:underline"
                                    >
                                        Sign up
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

export default SignIn