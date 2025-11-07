import React from "react";
import { Search, Mail, Bell, User } from "lucide-react";

const Topbar = ({ onSearchChange }) => {
  return (
    <header className="h-[64px] bg-[#121425] border-b border-[#0f1724] px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-[360px] bg-[#0c1018] border border-[#1f2937] rounded px-10 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Mail size={18} className="text-gray-300 cursor-pointer" />
          </div>
          <div className="relative">
            <Bell size={18} className="text-gray-300 cursor-pointer" />
          </div>
          <User size={18} className="text-gray-300 cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
