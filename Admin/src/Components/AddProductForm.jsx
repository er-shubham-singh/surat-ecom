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
  const filesArr = Array.from(e.target.files || []);
  // keep the raw File objects for upload
  const limited = filesArr.slice(0, 4);
  setSelectedFiles(limited); // used for UI list
  setImages(limited); // these must be File objects sent to backend

  // create preview URLs (revoke old ones to avoid memory leak)
  setPreviewImages((prev) => {
    // revoke previous
    prev.forEach(src => { try { URL.revokeObjectURL(src); } catch(e){} });
    return limited.map((f) => URL.createObjectURL(f));
  });
};


  // Build FormData and dispatch create or update
// Build FormData and dispatch create or update
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // ensure images state contains File objects (fallback to selectedFiles)
    const filesToSend = (Array.isArray(images) && images.length > 0) ? images : (Array.isArray(selectedFiles) ? selectedFiles : []);

    // Basic validation
    if (!filesToSend || filesToSend.length === 0) {
      console.error("No files to upload");
      setSuccess(false);
      setSuccessMessage("Please choose at least one image.");
      return;
    }

    const payload = new FormData();

    // Append simple fields (always as strings)
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
      // convert undefined/null -> empty string
      const val = formData[k] !== undefined && formData[k] !== null ? formData[k] : "";
      payload.append(k, String(val));
    });

    // If color can be an array, send as JSON string to be robust on backend
    if (Array.isArray(formData.color)) {
      payload.set("color", JSON.stringify(formData.color));
    } else {
      // keep as-is (string)
      // If it's a comma separated string you can still parse on backend
      payload.set("color", formData.color ?? "");
    }

    // Append sizes as JSON string (backend expects JSON string)
    payload.set("size", JSON.stringify(formData.size || []));

    // Append each File under the SAME field name that multer expects: "images"
    // Keep order and limit to 4
    filesToSend.slice(0, 4).forEach((file) => {
      payload.append("images", file);
    });

    // If editing, attach product id
    if (isEditing && formData._id) {
      payload.append("productId", formData._id);
    }

    // Dispatch the action. Most thunk/RTK actions return a promise — await it.
    // If your action creator expects raw FormData, this works. If it expects an object,
    // adapt the action to accept FormData or send with fetch/axios here.
    for (const pair of payload.entries()) {
  if (pair[1] instanceof File) console.log("FormData file:", pair[0], pair[1].name, pair[1].size);
  else console.log("FormData field:", pair[0], pair[1]);
}

    const result = await dispatch(isEditing ? updateProduct(payload) : createProduct(payload));

    // If your action returns a rejected promise it will throw and be caught below.
    // If it returns a success payload, handle it (optional)
    console.log("submit result:", result);

    // Show success and reset form
    setSuccess(true);
    setSuccessMessage(isEditing ? "Product updated successfully" : "Product created successfully");

    if (!isEditing) {
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

    // optional: navigate after create/update
    // navigate("/admin/products");
  } catch (err) {
    // If your action uses rejectWithValue or throws, you'll catch here
    console.error("submit error:", err);
    setSuccess(false);
    // if err.response exists (axios) prefer that, otherwise generic message
    const message = err?.message || "Action failed. Check console for details.";
    setSuccessMessage(message);
  }
};


  // When thirdLevelCategory changes, fetch size chart (only when not editing or when explicitly changed)
useEffect(() => {
  const third = formData.thirdLevelCategory;
  console.log("Selected 3rd-level category ->", third);
  if (!third) {
    setSizeChart(null);
    setFormData((prev) => ({ ...prev, size: [] }));
    return;
  }
  (async () => {
    try {
      const base = (typeof API_BASE_URL !== "undefined" && API_BASE_URL) || import.meta.env.VITE_React_BASE_API_URL || "";
      const url = `${base}api/admin/${encodeURIComponent(third)}`;
      console.log("Fetching size chart from:", url);

      const res = await fetch(url, { method: "GET" });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const txt = await res.text();
        console.error("Size chart fetch failed:", res.status, txt);
        setSizeChart(null);
        setFormData((prev) => ({ ...prev, size: [] }));
        return;
      }
      if (!ct.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got HTML/text:", text.slice(0, 400));
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

      const existingSizesMap = new Map((formData.size || []).map(s => [s.name, s.quantity]));
      const formattedSizes = data.sizes.map((sizeObj) => ({
        name: sizeObj.label,
        quantity: existingSizesMap.has(sizeObj.label) ? existingSizesMap.get(sizeObj.label) : 0,
      }));

      setSizeChart(data);
      setFormData((prev) => ({ ...prev, size: formattedSizes }));
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
