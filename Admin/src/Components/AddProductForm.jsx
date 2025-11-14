// src/components/AddProductForm.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createProduct, updateProduct } from "../redux/product/action"; 

import axios from 'axios'
import categoryHierarchy from "../data/categoryHierarchi";
const AddProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // If coming from update page, product is passed through location.state.product
  const productToUpdate = location?.state?.product || null;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [images, setImages] = useState([]); // File objects to send
  const [previewImages, setPreviewImages] = useState([]); // preview URLs
  const [sizeChart, setSizeChart] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    _id: null, // used to indicate editing
    images: "",
    brand: "",
    title: "",
    color: "",
    price: "",
    discountedPrice: "",
    discountPercentage: "",
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    description: "",
    quantity: "",
    size: [], // array for sizes/quantities
    freeSize: "",
  });

  // Populate form if editing
  useEffect(() => {
    if (!productToUpdate) return;

    // map product fields to our form naming
    const {
      _id,
      brand,
      title,
      color,
      price,
      discountedPrice,
      discountPersent, // if your API uses this typo, map it; otherwise use discountPercentage
      quantity,
      description,
      sizes,
      thirdLevelCategory, // prefer this
      thirdLavelCategory, // fallback for older data
      imageUrl,
    } = productToUpdate;

    const thirdCat = thirdLevelCategory || thirdLavelCategory || "";
    // get category path if function exists; otherwise just set third level
    let categoryPath = { topLevelCategory: "", secondLevelCategory: "" };
    if (typeof findCategoryPath === "function") {
      categoryPath = findCategoryPath(thirdCat);
    }

    setFormData((p) => ({
      ...p,
      _id,
      brand: brand || "",
      title: title || "",
      color: Array.isArray(color) ? color[0] : color || "",
      price: price || "",
      discountedPrice: discountedPrice || "",
      discountPercentage: discountPersent || p.discountPercentage || "",
      quantity: quantity || "",
      description: description || "",
      size: sizes?.length > 0 ? sizes : [],
      thirdLevelCategory: thirdCat,
      ...categoryPath,
    }));

    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      setPreviewImages(imageUrl);
    }
  }, [productToUpdate]);

  const isEditing = !!formData._id;

  function findCategoryPath(value) {
    if (!value || typeof categoryHierarchy === "undefined") {
      return { topLevelCategory: "", secondLevelCategory: "" };
    }
    for (const top in categoryHierarchy) {
      for (const second in categoryHierarchy[top]) {
        const thirdOptions = categoryHierarchy[top][second];
        for (const option of thirdOptions) {
          // option may be string or object { value, label }
          const optValue = typeof option === "string" ? option : option.value;
          if (optValue === value) {
            return {
              topLevelCategory: top,
              secondLevelCategory: second,
            };
          }
        }
      }
    }
    return { topLevelCategory: "", secondLevelCategory: "" };
  }

  // Controlled inputs handler
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

  // file input (default "Choose Files" styling) - updates selectedFiles but does not yet upload
  const handleFileChange = (e) => {
    const filesArr = Array.from(e.target.files);
    setSelectedFiles(filesArr);
    // also keep internal images and previews
    const limited = filesArr.slice(0, 4);
    setImages(limited);
    const previews = limited.map((f) => URL.createObjectURL(f));
    setPreviewImages(previews);
  };

  // Build FormData and dispatch create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    // Append simple fields
    const keysToAppend = [
      "brand",
      "title",
      "color",
      "price",
      "discountedPrice",
      "discountPercentage",
      "quantity",
      "description",
      "topLevelCategory",
      "secondLevelCategory",
      "thirdLevelCategory",
      "freeSize",
    ];
    keysToAppend.forEach((k) => {
      if (formData[k] !== undefined && formData[k] !== null) {
        payload.append(k, formData[k]);
      } else {
        payload.append(k, "");
      }
    });

    // Append sizes (array) as JSON
    payload.append("size", JSON.stringify(formData.size || []));

    // Append image files
    images.forEach((file) => {
      payload.append("images", file);
    });

    try {
      if (isEditing) {
        payload.append("productId", formData._id);
        await dispatch(updateProduct(payload)); // make sure updateProduct action returns a promise
        setSuccess(true);
        setSuccessMessage("Product updated successfully");
      } else {
        await dispatch(createProduct(payload));
        setSuccess(true);
        setSuccessMessage("Product created successfully");

        // reset form
        setFormData({
          _id: null,
          images: "",
          brand: "",
          title: "",
          color: "",
          price: "",
          discountedPrice: "",
          discountPercentage: "",
          topLevelCategory: "",
          secondLevelCategory: "",
          thirdLevelCategory: "",
          description: "",
          quantity: "",
          size: [],
          freeSize: "",
        });
        setImages([]);
        setSelectedFiles([]);
        setPreviewImages([]);
        setSizeChart(null);
      }

      // Optionally navigate back to products list after success
      // navigate("/admin/products");
    } catch (err) {
      console.error("submit error:", err);
      setSuccess(false);
      setSuccessMessage("Action failed. Check console for details.");
    }
  };

  // When thirdLevelCategory changes, fetch size chart (only when not editing or when explicitly changed)
useEffect(() => {
  const third = formData.thirdLevelCategory;
  // debug:
  console.log("Selected 3rd-level category ->", third);

  if (!third) {
    setSizeChart(null);
    setFormData((prev) => ({ ...prev, size: [] }));
    return;
  }

  (async () => {
    try {
      // Ensure API_BASE_URL is defined (falls back to empty string so fetch goes to same origin)
      const base = typeof API_BASE_URL !== "undefined" && API_BASE_URL ? API_BASE_URL : "";
      const url = `${base}/api/admin/${encodeURIComponent(third)}`;
      console.log("Fetching size chart from:", url);

      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        // log and bail
        console.error("Size chart fetch failed:", res.status, await res.text());
        setSizeChart(null);
        setFormData((prev) => ({ ...prev, size: [] }));
        return;
      }

      const data = await res.json();
      console.log("Size chart response:", data);

      if (!data?.sizes || data.sizes.length === 0) {
        setSizeChart(null);
        setFormData((prev) => ({ ...prev, size: [] }));
        return;
      }

      // map sizes into formData.size = [{ name: label, quantity: 0 }]
      // If you're editing product and it already has sizes, preserve quantities for matching labels
      const existingSizesMap = new Map((formData.size || []).map(s => [s.name, s.quantity]));
      const formattedSizes = data.sizes.map((sizeObj) => ({
        name: sizeObj.label,
        quantity: existingSizesMap.has(sizeObj.label) ? existingSizesMap.get(sizeObj.label) : 0,
      }));

      setSizeChart(data);

      // Only overwrite formData.size if user is NOT editing an existing product (or you want to overwrite)
      if (!productToUpdate) {
        setFormData((prev) => ({ ...prev, size: formattedSizes }));
      } else {
        // if productToUpdate exists, still set size structure so UI can show chart (but preserve product sizes if any)
        setFormData((prev) => ({ ...prev, size: formattedSizes }));
      }
    } catch (err) {
      console.error("Size chart fetch error:", err);
      setSizeChart(null);
      setFormData((prev) => ({ ...prev, size: [] }));
    }
  })();
}, [formData.thirdLevelCategory, productToUpdate]);

  // Compute second and third level options safely
  const secondLevelOptions = formData.topLevelCategory
    ? Object.keys(categoryHierarchy?.[formData.topLevelCategory] || {})
    : [];

  const thirdLevelOptions =
    formData.topLevelCategory &&
    formData.secondLevelCategory &&
    categoryHierarchy?.[formData.topLevelCategory]?.[formData.secondLevelCategory]
      ? categoryHierarchy[formData.topLevelCategory][formData.secondLevelCategory]
      : [];

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
      {/* File input */}
      <div className="mb-8">
        <label className="inline-flex items-center px-6 py-2 bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-md text-sm font-medium cursor-pointer hover:from-purple-600 hover:to-purple-700 transition">
          <span>Choose Files</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </label>

        {selectedFiles.length > 0 ? (
          <div className="mt-3 text-gray-300 text-sm space-y-1">
            <p className="font-medium">
              {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected:
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

        {/* previews */}
        <div className="mt-4 flex gap-3">
          {previewImages.map((src, i) => (
            <img key={i} src={src} alt={`preview-${i}`} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
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
          {Object.keys(categoryHierarchy || {}).map((key) => (
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
{thirdLevelOptions.map((t) => {
  const val = typeof t === "string" ? t : (t.value ?? t.label ?? "");
  const label = typeof t === "string" ? t : (t.label ?? t.value ?? "");
  return (
    <option key={val} value={val} className="text-black">
      {label}
    </option>
  );
})}

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
        />
      </div>

      {/* Free size */}
      <div className="mb-8">
{/* Size chart UI */}
{sizeChart?.sizes && sizeChart.sizes.length > 0 && (
  <div className="mb-6">
    <h3 className="mb-2 font-semibold">Available sizes (set quantities)</h3>
    <div className="grid grid-cols-2 gap-3">
      {sizeChart.sizes.map((sizeObj) => {
        const label = sizeObj.label;
        // find current quantity in formData.size
        const current = formData.size?.find(s => s.name === label) || { name: label, quantity: 0 };

        return (
          <div key={label} className="flex items-center gap-3">
            <div className="w-32">{label}</div>
            <input
              type="number"
              min="0"
              value={current.quantity}
              onChange={(e) => {
                const q = Number(e.target.value || 0);
                setFormData((prev) => {
                  const sizes = Array.isArray(prev.size) ? [...prev.size] : [];
                  const idx = sizes.findIndex(s => s.name === label);
                  if (idx >= 0) {
                    sizes[idx] = { ...sizes[idx], quantity: q };
                  } else {
                    sizes.push({ name: label, quantity: q });
                  }
                  return { ...prev, size: sizes };
                });
              }}
              className="w-24 bg-transparent border rounded px-2 py-1"
            />
          </div>
        );
      })}
    </div>
  </div>
)}

      </div>

      {/* Submit */}
      <div>
        <button type="submit" className="px-6 py-3 bg-[#8b5cf6] rounded text-white font-semibold">
          {isEditing ? "UPDATE PRODUCT" : "ADD NEW PRODUCT"}
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="mt-4 text-green-400">
          {successMessage || (isEditing ? "Updated successfully" : "Created successfully")}
        </div>
      )}
    </form>
  );
};

export default AddProductForm;
