import React, { useState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  sendVerifyOtp,
  confirmVerifyOtp,
  registerUser,
} from "../../redux/Auth/action";

function Register({ onClose, switchToLogin }) {
  const dispatch = useDispatch();
  const { loading, error, success, isVerified } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName:"",
    email: "",
    password: "",
  });
  const [showOtp, setShowOtp] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // if external isVerified changed (from reducer), open username/password
  useEffect(() => {
    if (isVerified) {
      setShowOtp(false);
      setEmailLocked(true);
    }
  }, [isVerified]);

  // -----------------
  // Send OTP
  // -----------------
  const handleSendOtp = async () => {
    if (!formData.email) return alert("Please enter your email first.");
    try {
      const res = await dispatch(sendVerifyOtp(formData.email));
      if (res?.success) {
        setShowOtp(true);
        setEmailLocked(true);
        setOtpSent(true);
        startResendTimer();
      } else {
        alert(res?.error || "Unable to send OTP");
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  // -----------------
  // Resend OTP (with timer)
  // -----------------
  const startResendTimer = () => {
    setResendTimer(30); // 30 seconds
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    try {
      const res = await dispatch(sendVerifyOtp(formData.email));
      if (res?.success) startResendTimer();
      else alert(res?.error || "Could not resend OTP");
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  // -----------------
  // Verify OTP
  // -----------------
  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP first.");
    try {
      const res = await dispatch(confirmVerifyOtp(formData.email, otp));
      if (res?.success) {
        // reducer's isVerified will flip; keep local UI in sync via useEffect
        setOtp("");
        setShowOtp(false);
      } else {
        alert(res?.error || "Invalid OTP");
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  // -----------------
  // Signup
  // -----------------
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Please verify your email first.");
      return;
    }
    try {
      const res = await dispatch(registerUser(formData));
      if (res?.success) {
        switchToLogin();
      } else {
        alert(res?.error || "Registration failed");
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h2 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-6">
        Create Account
      </h2>

      {/* Error & Success Messages */}
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded-md mb-3 text-center text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-600 p-2 rounded-md mb-3 text-center text-sm">
          {success}
        </div>
      )}

      <form className="flex flex-col space-y-4" onSubmit={handleSignup}>
        {/* Email + Send OTP */}
        <div>
          <label
            htmlFor="email"
            className="text-gray-700 font-medium block mb-1 text-left"
          >
            Email
          </label>
          <div className="flex space-x-2">
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              disabled={emailLocked}
              className={`flex-1 p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm ${
                emailLocked ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className={`px-4 rounded-lg font-medium text-sm transition ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
                className={`px-4 rounded-lg font-medium text-sm transition ${
                  resendTimer > 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
            )}
          </div>
        </div>

        {/* OTP Section */}
        {showOtp && (
          <div>
            <label
              htmlFor="otp"
              className="text-gray-700 font-medium block mb-1 text-left"
            >
              Enter OTP
            </label>
            <div className="flex space-x-2">
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className={`px-4 rounded-lg font-medium text-sm transition ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        )}

        {/* Username + Password (only after OTP verified) */}
        {isVerified && (
          <>
            <div>
              <label
                htmlFor="username"
                className="text-gray-700 font-medium block mb-1 text-left"
              >
                FirstName
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter Fisrt Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="text-gray-700 font-medium block mb-1 text-left"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-gray-700 font-medium block mb-1 text-left"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  className="w-full p-2 pr-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
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

            {/* Sign Up Button */}
            <button
              type="submit"
              className="font-semibold py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm"
            >
              Sign Up
            </button>
          </>
        )}

        {/* Login Link */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{" "}
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

export default Register;
