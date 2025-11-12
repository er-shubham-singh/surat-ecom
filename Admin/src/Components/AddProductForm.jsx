import React, { useState } from "react";

const categoryData = {
  makeup: {
    lips: ["Lipstick", "Lip Gloss", "Lip Liner"],
    eyes: ["Eyeliner", "Mascara", "Eyeshadow"],
    face: ["Foundation", "Blush", "Highlighter"],
  },
  skincare: {
    cleanser: ["Face Wash", "Scrub", "Micellar Water"],
    moisturizer: ["Day Cream", "Night Cream", "Gel Moisturizer"],
    serum: ["Vitamin C Serum", "Retinol Serum", "Hyaluronic Acid"],
  },
  accessories: {
    hair: ["Comb", "Brush", "Hair Bands"],
    tools: ["Makeup Brush", "Blender", "Tweezers"],
    others: ["Mirror", "Organizer", "Pouch"],
  },
};

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    brand: "",
    title: "",
    color: "",
    quantity: "",
    price: "",
    discountedPrice: "",
    discountPercentage: "",
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    description: "",
    freeSize: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "topLevelCategory") {
      setFormData((p) => ({
        ...p,
        [name]: value,
        secondLevelCategory: "",
        thirdLevelCategory: "",
      }));
    } else if (name === "secondLevelCategory") {
      setFormData((p) => ({ ...p, [name]: value, thirdLevelCategory: "" }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    // keep default "Choose Files" look while capturing files
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Files:", selectedFiles);
    // future: call API here
    alert("Product submitted — check console for data.");
  };

  const secondLevelOptions =
    formData.topLevelCategory && categoryData[formData.topLevelCategory]
      ? Object.keys(categoryData[formData.topLevelCategory])
      : [];

  const thirdLevelOptions =
    formData.topLevelCategory &&
    formData.secondLevelCategory &&
    categoryData[formData.topLevelCategory][formData.secondLevelCategory]
      ? categoryData[formData.topLevelCategory][formData.secondLevelCategory]
      : [];

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
      {/* File input (default browser style like screenshot) */}
      <div className="mb-8">
        <label className="inline-flex items-center px-6 py-2 bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-md text-sm font-medium cursor-pointer hover:from-purple-600 hover:to-purple-700 transition">
          <span>Choose Files</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {selectedFiles.length > 0 ? (
          <div className="mt-3 text-gray-300 text-sm space-y-1">
            <p className="font-medium">
              {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}{" "}
              selected:
            </p>
            <ul className="list-disc ml-5 space-y-0.5">
              {selectedFiles.map((file, index) => (
                <li key={index} className="truncate max-w-sm text-gray-400">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <span className="ml-3 text-gray-400 text-sm">No files chosen</span>
        )}
      </div>

      {/* Brand & Title */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <input
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          placeholder="Brand"
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
        />
        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Color & Quantity */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <input
          name="color"
          value={formData.color}
          onChange={handleInputChange}
          placeholder="Color"
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
        />
        <input
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
          type="number"
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Price row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <input
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          type="number"
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
        />
        <input
          name="discountedPrice"
          value={formData.discountedPrice}
          onChange={handleInputChange}
          placeholder="Discounted Price"
          type="number"
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
        />
        <input
          name="discountPercentage"
          value={formData.discountPercentage}
          onChange={handleInputChange}
          placeholder="Discount Percentage"
          type="number"
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Category row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <select
          name="topLevelCategory"
          value={formData.topLevelCategory}
          onChange={handleInputChange}
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-300 focus:outline-none"
        >
          <option value="">Top Level Category</option>
          {Object.keys(categoryData).map((key) => (
            <option key={key} value={key} className="text-black">
              {key}
            </option>
          ))}
        </select>

        <select
          name="secondLevelCategory"
          value={formData.secondLevelCategory}
          onChange={handleInputChange}
          disabled={!secondLevelOptions.length}
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-300 focus:outline-none disabled:opacity-60"
        >
          <option value="">Second Level Category</option>
          {secondLevelOptions.map((s) => (
            <option key={s} value={s} className="text-black">
              {s}
            </option>
          ))}
        </select>

        <select
          name="thirdLevelCategory"
          value={formData.thirdLevelCategory}
          onChange={handleInputChange}
          disabled={!thirdLevelOptions.length}
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-300 focus:outline-none disabled:opacity-60"
        >
          <option value="">Third Level Category</option>
          {thirdLevelOptions.map((t) => (
            <option key={t} value={t.toLowerCase()} className="text-black">
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-6">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          rows="5"
          className="w-full bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
        ></textarea>
      </div>

      {/* Free size */}
      <div className="mb-8">
        <input
          name="freeSize"
          value={formData.freeSize}
          onChange={handleInputChange}
          placeholder="Quantity (Free Size) *"
          type="number"
          className="w-1/2 bg-transparent border border-[#24303e] rounded px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#8b5cf6] rounded text-white font-semibold"
        >
          ADD NEW PRODUCT
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
