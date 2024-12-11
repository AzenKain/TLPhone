"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [isOtpPage, setIsOtpPage] = useState(false);
  const [isNewPasswordPage, setIsNewPasswordPage] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const router = useRouter();

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpPage(true);
    setEmail("");
  };

  const handleSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtp("");
    setIsOtpPage(false);
    setIsNewPasswordPage(true);
  };

  const handleSubmitNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === retypePassword) {
      setIsNewPasswordPage(false);
      setIsSuccessModalOpen(true);
    }
    else {
      alert("Passwords do not match!");
    }
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    router.push('/auth/signin');
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
            Don't fret! Just type in your email and we will send you a code to reset your password!
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
                placeholder="name@company.com"
              />
            </div>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I accept the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>
              </label>
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

      {/* Modal thông báo đổi mật khẩu thành công */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-sm text-gray-500 mb-4">
              Your password has been successfully reset.
            </p>
            <button
              onClick={handleCloseModal}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
