import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Users, Plus } from "lucide-react";

const navItem = (to, Icon, label, active) => (
  <Link
    to={to}
    className={`flex items-center gap-4 px-6 py-4 text-sm w-full text-left transition ${
      active
        ? "bg-[#0f1724] text-white border-l-4 border-purple-600"
        : "text-gray-300 hover:bg-[#111423]"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-[230px] bg-[#0b1220] flex flex-col min-h-screen border-r border-[#111827]">
      {/* Logo / top icon */}
      <div className="h-[60px] flex items-center justify-center border-b border-[#111827]">
        <div
          className="w-12 h-12 bg-[#0f1724] flex items-center justify-center"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <span className="text-2xl font-bold text-yellow-500">✦</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <div className="flex flex-col space-y-1">
          {navItem(
            "/dashboard",
            LayoutDashboard,
            "Dashboard",
            pathname === "/dashboard"
          )}
          {navItem("/products", Package, "Products", pathname === "/products")}
          {navItem("/customers", Users, "Customers", pathname === "/customers")}
          {navItem(
            "/add-product",
            Plus,
            "Add Product",
            pathname === "/add-product"
          )}
        </div>
      </nav>

      {/* Footer avatar */}
      <div className="p-4 border-t border-[#0f1724]">
        <div className="w-10 h-10 bg-[#6b21a8] rounded-full flex items-center justify-center">
          <span className="text-lg font-semibold">A</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
