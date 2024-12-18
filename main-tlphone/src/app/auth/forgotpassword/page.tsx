"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {createOtpApi, forgetPasswordApi, validateOtpApi} from "@/lib/api";
import {CreateOtpDto, ForgetPasswordDto, VerifyOtpDto} from "@/lib/dtos/auth";
import {signIn} from "next-auth/react";

export default function ResetPassword() {
  const router = useRouter();
  const [isOtpPage, setIsOtpPage] = useState(false);
  const [isNewPasswordPage, setIsNewPasswordPage] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState<number>(-1);
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      toast.error("You must enter your email!");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format!");
      return;
    }
    const dto : CreateOtpDto = {
      email: email,
      type: "ForgotPassword",
    }
    const rq = await createOtpApi(dto, null)
    if (!rq || !rq.isRequest) {
      toast.error("Failed to create otp!");
      return
    }
    toast.success("Create otp successfully")
    setIsOtpPage(true);
  };

  const handleSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "") {
      toast.error("You must enter your otp!");
      return
    }
    const dto : VerifyOtpDto = {
      email: email,
      type: "ForgotPassword",
      otpCode: otp
    }
    const rq = await validateOtpApi(dto, null)
    if (!rq || !rq.otpId || !rq.isRequest ) {
      toast.error("Failed to create otp!");
      return
    }
    toast.success("Verify otp successfully")
    setOtpId(Number(rq.otpId))
    setIsOtpPage(false);
    setIsNewPasswordPage(true);
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpId === -1) {
      toast.error("OtpId is not exist!");
    }
    if (newPassword !== retypePassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const dto : ForgetPasswordDto = {
      email: email,
      otpId: otpId,
      password: newPassword
    }
    const rq = await forgetPasswordApi(dto, null)
    if (!rq || !rq.isRequest) {
      toast.error("Failed to create otp!");
      return
    }
    toast.success("Create new password successfully")
    const res = await signIn("credentials", {
      email: email,
      password: newPassword,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
      toast.success("Welcome back!!");
    } else {
      toast.error("Check your email or password!");
    }
    setIsNewPasswordPage(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      {isNewPasswordPage ? (
        // Giao diện nhập mật khẩu mới
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Set New Password</h1>
          <p className="text-sm text-gray-500 mb-6">
            Please enter a new password for your account.
          </p>
          <form className="space-y-4" onSubmit={handleSubmitNewPassword}>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label
                htmlFor="retypePassword"
                className="block text-sm font-medium text-gray-700"
              >
                Retype Password
              </label>
              <input
                type="password"
                id="retypePassword"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Retype your new password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset Password
            </button>
          </form>
        </div>
      ) : isOtpPage ? (
        // Giao diện OTP
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Enter OTP</h1>
          <p className="text-sm text-gray-500 mb-6">
            Please enter the code we sent to your email to reset your password.
          </p>
          <form className="space-y-4" onSubmit={handleSubmitOtp}>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter OTP"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Confirm
            </button>
          </form>
        </div>
      ) : (
        // Giao diện Reset Password
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Forgot your password?
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Don&#39;t fret! Just type in your email and we will send you a code to reset your password!
          </p>
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="name@gmail.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Continue
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
