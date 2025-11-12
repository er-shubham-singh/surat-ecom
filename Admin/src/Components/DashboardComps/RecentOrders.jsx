import React from "react";

const StatusBadge = ({ status }) => {
  const statusColors = {
    PENDING: "bg-yellow-500",
    DELIVERED: "bg-green-500",
    CANCELLED: "bg-red-500",
    PROCESSING: "bg-blue-500",
  };

  return (
    <span
      className={`${statusColors[status]} text-white text-xs font-medium px-3 py-1 rounded-full`}
    >
      {status}
    </span>
  );
};

const RecentOrders = ({ orders }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
        <a
          href="#"
          className="text-blue-500 hover:text-blue-400 text-sm font-medium"
        >
          View All
        </a>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 pb-3 mb-3 border-b border-slate-700/50">
        <div className="col-span-2 text-slate-400 text-sm font-medium">
          Image
        </div>
        <div className="col-span-3 text-slate-400 text-sm font-medium">
          Title
        </div>
        <div className="col-span-2 text-slate-400 text-sm font-medium">
          Price
        </div>
        <div className="col-span-2 text-slate-400 text-sm font-medium">
          Order ID
        </div>
        <div className="col-span-3 text-slate-400 text-sm font-medium">
          Status
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 items-center py-2 hover:bg-slate-700/30 rounded transition-colors"
          >
            <div className="col-span-2">
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
            <div className="col-span-3 text-slate-200 text-sm">
              {order.title || ""}
            </div>
            <div className="col-span-2 text-slate-200 text-sm">
              ₹{order.price}
            </div>
            <div className="col-span-2 text-slate-200 text-sm">
              {order.orderId}
            </div>
            <div className="col-span-3">
              <StatusBadge status={order.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
