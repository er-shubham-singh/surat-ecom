import React, { useEffect, useState, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("low-high");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const navigate = useNavigate();

  // 🧩 Mock data (replace with Redux API later)
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        title: "Cotton Pants",
        brand: "Fluteon",
        category: "cotton_pants",
        price: 649,
        quantity: 5,
        image:
          "https://res.cloudinary.com/dbxx5ccf4/image/upload/v1752502168/ecommerce/products/dfkwhrvhtssviuc1re66.jpg",
      },
      {
        id: 2,
        title: "Formal Skirts",
        brand: "Fluteon",
        category: "skirts",
        price: 999,
        quantity: 2,
        image:
          "https://res.cloudinary.com/dbxx5ccf4/image/upload/v1752502168/ecommerce/products/dfkwhrvhtssviuc1re66.jpg",
      },
      {
        id: 3,
        title: "Formal Shirts",
        brand: "Fluteon",
        category: "formal_shirts",
        price: 1099,
        quantity: 5,
        image:
          "https://res.cloudinary.com/dbxx5ccf4/image/upload/v1752502168/ecommerce/products/dfkwhrvhtssviuc1re66.jpg",
      },
      {
        id: 4,
        title: "Casual Trousers",
        brand: "Fluteon",
        category: "casual_trousers",
        price: 799,
        quantity: 0,
        image:
          "https://res.cloudinary.com/dbxx5ccf4/image/upload/v1752502168/ecommerce/products/dfkwhrvhtssviuc1re66.jpg",
      },
      {
        id: 5,
        title: "Denim Jeans",
        brand: "Fluteon",
        category: "denim_jeans",
        price: 899,
        quantity: 3,
        image:
          "https://res.cloudinary.com/dbxx5ccf4/image/upload/v1752502168/ecommerce/products/dfkwhrvhtssviuc1re66.jpg",
      },
      {
        id: 6,
        title: "Denim Jeans",
        brand: "Fluteon",
        category: "denim_jeans",
        price: 899,
        quantity: 3,
        image:
          "https://res.cloudinary.com/dbxx5ccf4/image/upload/v1752502168/ecommerce/products/dfkwhrvhtssviuc1re66.jpg",
      },
      // Add more mock data...
    ];
    setProducts(mockProducts);
  }, []);

  // 🧮 Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (categoryFilter)
      filtered = filtered.filter((p) => p.category === categoryFilter);
    if (availabilityFilter === "in-stock")
      filtered = filtered.filter((p) => p.quantity > 0);
    if (availabilityFilter === "out-of-stock")
      filtered = filtered.filter((p) => p.quantity === 0);

    if (sortOrder === "low-high") filtered.sort((a, b) => a.price - b.price);
    if (sortOrder === "high-low") filtered.sort((a, b) => b.price - a.price);

    return filtered;
  }, [products, categoryFilter, availabilityFilter, sortOrder]);

  // 🧭 Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // 🔧 Handlers (ready for Redux integration)
  const handleUpdate = (product) => {
    navigate("/admin/update-product", { state: { product } });
    // dispatch(updateProduct(id))
  };

  const handleDelete = (id) => {
    console.log("Delete product:", id);
    // dispatch(deleteProduct(id))
  };

  return (
    <div className="p-6 text-gray-200 bg-[#0f1120] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">All Products</h1>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6 bg-[#15172b] p-4 rounded-xl">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#1b1e36] text-gray-300 p-3 rounded-lg w-56 outline-none"
        >
          <option value="">Category</option>
          <option value="cotton_pants">Cotton Pants</option>
          <option value="skirts">Skirts</option>
          <option value="formal_shirts">Formal Shirts</option>
        </select>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="bg-[#1b1e36] text-gray-300 p-3 rounded-lg w-56 outline-none"
        >
          <option value="">Availability</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-[#1b1e36] text-gray-300 p-3 rounded-lg w-56 outline-none"
        >
          <option value="low-high">Sort by Price: Low - High</option>
          <option value="high-low">Sort by Price: High - Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#15172b] rounded-xl">
        <table className="min-w-full text-left text-gray-300">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Update</th>
              <th className="py-3 px-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.id} className="hover:bg-[#1e213a] transition">
                <td className="py-3 px-4">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.brand}</p>
                  </div>
                </td>
                <td className="py-3 px-4">{p.category}</td>
                <td className="py-3 px-4">₹{p.price.toFixed(2)}</td>
                <td className="py-3 px-4">{p.quantity}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleUpdate(p)}
                    className="text-indigo-400 hover:text-indigo-500 transition"
                  >
                    UPDATE
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-400 hover:text-red-500 transition"
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-full ${
              currentPage === i + 1
                ? "bg-indigo-500 text-white"
                : "bg-[#1b1e36] text-gray-400 hover:bg-indigo-600 hover:text-white"
            } transition`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
