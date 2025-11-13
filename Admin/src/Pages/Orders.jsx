import React, { useState } from "react";
import Pagination from "../Components/Pagination";
import StatusDropdown from "../Components/StatusDropdown";

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const allOrders = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3f89?w=200", // sample image
      title: "Blazer",
      subtitle: "Fluteon",
      price: 1695,
      orderId: "6889def827bad6a5f3a81ddc",
      status: "CONFIRMED",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1520975918318-3c0c0c9c48e2?w=200",
      title: "Blazer",
      subtitle: "Fluteon",
      price: 6780,
      orderId: "6889dace27bad6a5f3a819dd",
      status: "CONFIRMED",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1542060748-10c28b62716e?w=200",
      title: "Blazer",
      subtitle: "Fluteon",
      price: 1695,
      orderId: "6887124d501af45a411875ec",
      status: "SHIPPED",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200",
      title: "Dress",
      subtitle: "Fluteon",
      price: 2499,
      orderId: "6889def827bad6a5f3a81dde",
      status: "PENDING",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1593032465171-8a5a37fdd0c2?w=200",
      title: "Shirt",
      subtitle: "Fluteon",
      price: 1299,
      orderId: "6889def827bad6a5f3a81ddf",
      status: "DELIVERED",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1520975918318-3c0c0c9c48e2?w=200",
      title: "Jeans",
      subtitle: "Fluteon",
      price: 3499,
      orderId: "6889def827bad6a5f3a81de0",
      status: "CONFIRMED",
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200",
      title: "T-Shirt",
      subtitle: "Fluteon",
      price: 899,
      orderId: "6889def827bad6a5f3a81de1",
      status: "CANCELLED",
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1556909212-d03a9d1b06d9?w=200",
      title: "Jacket",
      subtitle: "Fluteon",
      price: 4999,
      orderId: "6889def827bad6a5f3a81de2",
      status: "SHIPPED",
    },
    {
      id: 9,
      image:
        "https://images.unsplash.com/photo-1593032465171-8a5a37fdd0c2?w=200",
      title: "Sweater",
      subtitle: "Fluteon",
      price: 2199,
      orderId: "6889def827bad6a5f3a81de3",
      status: "CONFIRMED",
    },
    {
      id: 10,
      image:
        "https://images.unsplash.com/photo-1593032465171-8a5a37fdd0c2?w=200",
      title: "Shorts",
      subtitle: "Fluteon",
      price: 1499,
      orderId: "6889def827bad6a5f3a81de4",
      status: "PENDING",
    },
  ];

  const totalPages = Math.ceil(allOrders.length / itemsPerPage);
  const currentOrders = allOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNum) => setCurrentPage(pageNum);

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: "bg-yellow-500",
      SHIPPED: "bg-purple-500",
      DELIVERED: "bg-green-500",
      PENDING: "bg-orange-500",
      CANCELLED: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">All Orders</h1>

        <div className="overflow-hidden rounded-lg bg-[#15172b] shadow-lg border border-slate-700/60">
          {/* Table Header */}
          <div className="grid grid-cols-13 gap-4 py-4 px-6 border-b border-slate-700 text-slate-300 font-medium text-sm">
            <div>Image</div>
            <div className="col-span-2">Title</div>
            <div>Price</div>
            <div className="col-span-3">Id</div>
            <div className="col-span-2">Payment</div>
            <div>View</div>
            <div>Status</div>
            <div>Update</div>
            <div>Delete</div>
          </div>

          {/* Orders */}
          <div className="divide-y divide-slate-700">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-13 gap-4 py-4 px-6 items-center hover:bg-slate-700/40 transition-colors"
              >
                {/* Image */}
                <div>
                  <img
                    src={order.image}
                    alt={order.title}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                {/* Title */}
                <div className="col-span-2">
                  <p className="text-slate-200 font-medium text-sm">
                    {order.title}
                  </p>
                  <p className="text-slate-400 text-xs">{order.subtitle}</p>
                </div>

                {/* Price */}
                <div className="text-sm">{order.price}</div>

                {/* Order ID */}
                <div className="col-span-3 text-xs text-slate-400 truncate">
                  {order.orderId}
                </div>

                {/* Payment */}
                <div className="col-span-2">
                  <button className="px-3 py-1 text-xs font-medium text-purple-400 border border-purple-400 rounded hover:bg-purple-500/10">
                    PAYMENT HISTORY
                  </button>
                </div>

                {/* View */}
                <div>
                  <button className="px-3 py-1 text-xs font-medium text-purple-400 border border-purple-400 rounded hover:bg-purple-500/10">
                    VIEW
                  </button>
                </div>

                {/* Status */}
                <div className="-ml-3">
                  <span
                    className={`${getStatusColor(
                      order.status
                    )} text-white text-[11px] font-semibold px-3 py-1 rounded-full`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Dropdown */}
                <div>
                  <StatusDropdown currentStatus={order.status} />
                </div>

                {/* Delete */}
                <div>
                  <button className="text-purple-400 text-xs font-medium hover:text-purple-300">
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
