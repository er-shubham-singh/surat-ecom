// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { sendResetOtp, resetPassword } from "../../redux/Auth/action";

function ForgotPassword({ onClose, switchToLogin }) {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) return alert("Please enter your email.");

    const res = await dispatch(sendResetOtp(email));
    if (res?.success || res?.message) setShowOtp(true);
  };

  // 🔹 Step 2: Verify OTP (frontend check for now)
  const handleVerifyOtp = () => {
    if (otp.trim() === "") return alert("Enter the OTP sent to your email.");
    // You can later add backend OTP verification if needed
    setIsVerified(true);
  };

  // 🔹 Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert("Please enter a new password.");

    const res = await dispatch(resetPassword(email, otp, newPassword));
    if (res?.success || res?.message) {
      alert("Password reset successful!");
      switchToLogin();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h2 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-6">
        Reset Password
      </h2>

      {/* 🔸 Error / Success Alerts */}
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded-md mb-3 text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-600 p-2 rounded-md mb-3 text-sm">
          {message}
        </div>
      )}

      <form className="flex flex-col space-y-4" onSubmit={handleResetPassword}>
        {/* Email */}
        <div>
          <label className="block text-left font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
            />
            {!showOtp && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className={`px-4 rounded-lg text-sm font-medium transition ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            )}
          </div>
        </div>

        {/* OTP */}
        {showOtp && !isVerified && (
          <div>
            <label className="block text-left font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="px-4 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {/* New Password */}
        {isVerified && (
          <div>
            <label className="block text-left font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 pr-10 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {isVerified && (
          <button
            type="submit"
            disabled={loading}
            className="font-semibold py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        )}

        {/* Back to Login */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => switchToLogin()}
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
