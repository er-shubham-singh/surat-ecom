import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/Auth/action";

function Login({ onClose, switchToRegister, switchToForgot }) {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    dispatch(loginUser({ email, password })).then((res) => {
      if (res?.success) {
        setTimeout(() => {
          onClose(); // Close modal on successful login
        }, 1000);
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h2 className="text-gray-800 text-2xl sm:text-3xl font-bold mb-6">
        Login
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

      <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
        {/* Email */}
        <div className="text-left">
          <label
            htmlFor="email"
            className="text-gray-700 font-medium block mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
            required
          />
        </div>

        {/* Password */}
        <div className="relative text-left">
          <label
            htmlFor="password"
            className="text-gray-700 font-medium block mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pr-10 rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[2.65rem] text-gray-500 hover:text-indigo-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-right text-sm">
          <button
            type="button"
            onClick={switchToForgot}
            className="text-indigo-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`font-semibold py-2 rounded-lg transition text-sm ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Switch to Signup */}
      <p className="mt-4 text-center text-gray-600 text-sm">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={() => switchToRegister()}
          className="text-indigo-600 hover:underline font-medium"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;
