import React from "react";
import { useNavigate } from "react-router-dom";

const NewCustomers = ({ customers }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">New Customers</h2>
        <a
          href="#"
          className="text-blue-500 hover:text-blue-400 text-sm font-medium"
          onClick={() => { navigate("/customers"); }}
        >
          View All
        </a>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-2 gap-4 pb-3 mb-3 border-b border-slate-700/50">
        <div className="text-slate-400 text-sm font-medium">Image</div>
        <div className="text-slate-400 text-sm font-medium">Email</div>
      </div>

      {/* Customer List */}
      <div className="space-y-3 overflow-y-auto">
        {customers.map((customer, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 items-center py-2 hover:bg-slate-700/30 rounded transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="text-slate-200 text-sm">{customer.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewCustomers;
