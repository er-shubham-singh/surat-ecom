import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productToEdit = location.state?.product || null;

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    color: "",
    price: "",
    discountedPrice: "",
    discountPercentage: "",
    quantity: "",
    topCategory: "",
    midCategory: "",
    subCategory: "",
    description: "",
    sizes: [
      { name: "S", quantity: "" },
      { name: "M", quantity: "" },
      { name: "L", quantity: "" },
      { name: "XL", quantity: "" },
      { name: "XXL", quantity: "" },
      { name: "3XL", quantity: "" },
      { name: "4XL", quantity: "" },
      { name: "5XL", quantity: "" },
    ],
    images: [],
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...formData,
        ...productToEdit,
      });
    }
  }, [productToEdit]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...newImages] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🟣 Updated Product:", formData);
    navigate("/products");
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-[#0f1120] text-gray-200 px-6 py-10 overflow-y-auto">
      <h1 className="text-4xl font-bold text-center mb-10">Update Product</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-[#15172b] p-8 rounded-2xl shadow-lg"
      >
        {/* Image Upload */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Product Images
          </label>

          <div className="flex items-center gap-4">
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
            >
              Upload Images
              <input
                id="image-upload"
                type="file"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <span className="text-gray-400 text-sm">
              {formData.images.length
                ? `${formData.images.length} image${
                    formData.images.length > 1 ? "s" : ""
                  } uploaded`
                : "No images uploaded yet"}
            </span>
          </div>

          {/* Preview Gallery */}
          {formData.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {formData.images.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-md overflow-hidden border border-gray-700"
                >
                  <img
                    src={img}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Brand", name: "brand" },
            { label: "Title", name: "title" },
            { label: "Color", name: "color" },
            { label: "Quantity", name: "quantity", type: "number" },
            { label: "Price", name: "price", type: "number" },
            {
              label: "Discounted Price",
              name: "discountedPrice",
              type: "number",
            },
            {
              label: "Discount Percentage",
              name: "discountPercentage",
              type: "number",
            },
          ].map((field, i) => (
            <div key={i}>
              <label className="block mb-1 text-sm">{field.label}</label>
              <input
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                type={field.type || "text"}
                className="w-full bg-[#1b1e36] p-3 rounded-md text-gray-200 outline-none"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        {/* Category Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <select
            name="topCategory"
            value={formData.topCategory}
            onChange={handleChange}
            className="bg-[#1b1e36] p-3 rounded-md text-gray-300 outline-none"
          >
            <option value="">Top Level Category</option>
            <option value="men">MEN</option>
            <option value="women">WOMEN</option>
          </select>

          <select
            name="midCategory"
            value={formData.midCategory}
            onChange={handleChange}
            className="bg-[#1b1e36] p-3 rounded-md text-gray-300 outline-none"
          >
            <option value="">Second Level Category</option>
            <option value="topwear">Top Wear</option>
            <option value="bottomwear">Bottom Wear</option>
          </select>

          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            className="bg-[#1b1e36] p-3 rounded-md text-gray-300 outline-none"
          >
            <option value="">Third Level Category</option>
            <option value="formal_pants">Formal Pants</option>
            <option value="casual_pants">Casual Pants</option>
          </select>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block mb-1 text-sm">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-[#1b1e36] p-3 rounded-md text-gray-200 outline-none"
            placeholder="Enter product description..."
          />
        </div>

        {/* Sizes */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Sizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.sizes.map((size, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={size.name}
                  onChange={(e) =>
                    handleSizeChange(index, "name", e.target.value)
                  }
                  className="flex-1 bg-[#1b1e36] p-3 rounded-md text-gray-200 outline-none"
                  placeholder="Size"
                />
                <input
                  type="number"
                  value={size.quantity}
                  onChange={(e) =>
                    handleSizeChange(index, "quantity", e.target.value)
                  }
                  className="flex-1 bg-[#1b1e36] p-3 rounded-md text-gray-200 outline-none"
                  placeholder="Qty"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center gap-6">
          <button
            type="button"
            onClick={handleCancel}
            className="border border-gray-500 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-700/50 transition"
          >
            CANCEL
          </button>

          <button
            type="submit"
            className="bg-linear-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            UPDATE PRODUCT
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
