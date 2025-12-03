import React from "react";
import { useNavigate } from "react-router-dom";
import { TbError404 } from "react-icons/tb";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center"
      style={{ backgroundColor: "#FFF9E8" }}
    >
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        {/* Icon */}
        <div className="flex justify-center" style={{ color: "#CBE600" }}>
          <TbError404 className="text-6xl sm:text-8xl md:text-9xl animate-bounce" />
        </div>

        {/* Text */}
        <div className="space-y-3 sm:space-y-4">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
            style={{ color: "#111111" }}
          >
            Oops! Page Not Found
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-md mx-auto px-4">
            Sorry, we couldn't find the page you're looking for at Venus
            Garments.
            <br className="hidden sm:block" />
            It might have been moved or doesn't exist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 px-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            style={{ backgroundColor: "#DFF200", color: "#111111" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#CBE600")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#DFF200")}
          >
            Go to Homepage
          </button>
          <button
            onClick={() => navigate("/contact-us")}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base border-2 transition-all duration-300 hover:shadow-lg bg-white"
            style={{ borderColor: "#CBE600", color: "#111111" }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#CBE600";
              e.target.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#FFFFFF";
              e.target.style.color = "#111111";
            }}
          >
            Contact Support →
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "#DFF200" }}
          />
          <div
            className="w-2 h-2 rounded-full animate-pulse delay-75"
            style={{ backgroundColor: "#CBE600" }}
          />
          <div
            className="w-2 h-2 rounded-full animate-pulse delay-150"
            style={{ backgroundColor: "#DFF200" }}
          />
        </div>
      </div>
    </main>
  );
}