import React from "react";
import { useNavigate } from "react-router-dom";


const RecentlyAddedProducts = ({ products }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Recently Added Products
        </h2>
        <a
          href="#"
          className="text-blue-500 hover:text-blue-400 text-sm font-medium"
          onClick={()=>{navigate('/products')}}
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
        <div className="col-span-3 text-slate-400 text-sm font-medium">
          Category
        </div>
        <div className="col-span-2 text-slate-400 text-sm font-medium">
          Price
        </div>
        <div className="col-span-2 text-slate-400 text-sm font-medium">
          Quantity
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {products.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 items-center py-2 hover:bg-slate-700/30 rounded transition-colors"
          >
            <div className="col-span-2">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-600 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-6 h-6 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="col-span-3">
              <div className="text-slate-200 text-sm font-medium">
                {product.title}
              </div>
              <div className="text-slate-400 text-xs">{product.brand}</div>
            </div>
            <div className="col-span-3 text-slate-200 text-sm">
              {product.category}
            </div>
            <div className="col-span-2 text-slate-200 text-sm">
              {product.price}
            </div>
            <div className="col-span-2 text-slate-200 text-sm">
              {product.quantity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAddedProducts;
