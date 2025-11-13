import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const StatusDropdown = ({ currentStatus }) => {
  const actions = [
    "CONFIRM ORDER",
    "SHIP ORDER",
    "OUT FOR DELIVERY",
    "DELIVER ORDER",
    "APPROVE RETURN",
  ];

  const orderFlow = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "OUT FOR DELIVERY",
    "DELIVERED",
  ];

  const currentIndex = orderFlow.indexOf(currentStatus?.toUpperCase());

  const getItemStyle = (index) => {
    if (index <= currentIndex && currentIndex !== -1) {
      // Completed or current step → dull it
      return "bg-gray-700 text-gray-400 cursor-not-allowed";
    } else {
      // Future steps
      return "hover:bg-[#2a2f46] text-white cursor-pointer";
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="text-purple-400 text-xs font-medium hover:text-purple-300">
          STATUS
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          className="bg-[#1e2235] text-white rounded-md shadow-lg p-2 w-52 border border-slate-700 z-50"
        >
          {actions.map((label, i) => (
            <DropdownMenu.Item
              key={label}
              disabled={++i <= currentIndex}
              className={`px-3 py-2 rounded-md text-sm select-none ${getItemStyle(
                i
              )}`}
            >
              {label}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Arrow className="fill-[#1e2235]" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default StatusDropdown;
