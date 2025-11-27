import React from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-white text-white overflow-hidden">
      {/* Fixed Topbar */}
      <div className="shrink-0 z-10">
        <Topbar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
