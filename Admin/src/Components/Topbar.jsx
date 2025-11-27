import React from "react";
import { Search, Bell, Mail, User } from "lucide-react";

const Topbar = () => {
  return (
    <header className="h-[65px] bg-white border-b border-gray-700 px-6 flex items-center justify-between">
      {/* Left Side - Logo */}
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 bg-linear-to-br from-yellow-600 to-yellow-800 flex items-center justify-center"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <span className="text-xl font-bold">✦</span>
        </div>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>

      {/* Middle - Search */}
      <div className="relative w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-[#1a2542] border-0 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Right Side - Stats + Icons */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <Mail size={20} className="text-gray-400 hover:text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
              0
            </span>
          </div>

          <div className="relative cursor-pointer">
            <Bell size={20} className="text-gray-400 hover:text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              0
            </span>
          </div>

          <User
            size={20}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
