import React from "react";
import Marquee from "react-fast-marquee";

function AddsBar() {
  const Message1 = () => (
    <span className="mx-8 text-[#5A8F00] text-sm sm:text-base font-semibold whitespace-nowrap flex items-center gap-2">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
      COD not available
    </span>
  );

  const Message2 = () => (
    <span className="mx-8 text-[#5A8F00] text-sm sm:text-base font-semibold whitespace-nowrap flex items-center gap-2">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      Free delivery all over India
    </span>
  );

  return (
    <div
      className="py-2 border-b border-gray-300 relative shadow-sm"
      style={{ backgroundColor: "#FFF9E8" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      <div className="relative">
        <Marquee gradient={false} speed={65}>
          <Message1 />
          <Message2 />
          <Message1 />
          <Message2 />
          <Message1 />
          <Message2 />
                    <Message1 />
          <Message2 />
        </Marquee>
      </div>
    </div>
  );
}

export default AddsBar;