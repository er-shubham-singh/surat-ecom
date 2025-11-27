import React from "react";
import { LayoutDashboard, Package, Users, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    { label: "Products", icon: <Package size={20} />, path: "/products" },
    { label: "Customers", icon: <Users size={20} />, path: "/customers" },
    { label: "Add Product", icon: <Plus size={20} />, path: "/add-product" },
    {label: "Orders" , path:"/orders"},
    {label:"Create Coupon", path:"/create-coupon"} 
  ];

  return (
    <aside className="w-[230px] h-full bg-white border-r border-gray-700 flex flex-col">
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 text-black transition hover:bg-[#1a2542] hover:text-white ${
                isActive
                  ? "bg-[#1a2542] border-l-4 border-purple-500 text-white"
                  : ""
              }`
            }
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom avatar */}
      <div className="p-4 border-t border-gray-700">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-lg font-semibold">A</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
