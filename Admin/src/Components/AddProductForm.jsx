// src/components/AddProductForm.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createProduct, updateProduct } from "../Redux/Customers/Product/Action"; 

import axios from 'axios'
import categoryHierarchy from "../data/categoryHierarchi";
const AddProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // If coming from update page, product is passed through location.state.product
  const productToUpdate = location?.state?.product || null;
  console.log("product to updarte.....", productToUpdate)

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
      _id:productToUpdate._id,
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
  const limited = filesArr.slice(0, 4);
  // ensure all items are File instances
  console.log("Picked files:", limited.map(f => ({ name: f.name, isFile: f instanceof File })));
  setSelectedFiles(limited);
  setImages(limited);
  setPreviewImages(prev => {
    prev.forEach(src => { try { URL.revokeObjectURL(src); } catch(e){} });
    return limited.map((f) => URL.createObjectURL(f));
  });
};

  const isEditing = !!formData._id;
console.log("is editiing id ....",formData._id)
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




const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Build FormData exactly like your original simple version
    const payload = new FormData();

    // Append all keys from formData; stringify 'size'
    for (let key in formData) {
      if (key === "size") {
        payload.append("size", JSON.stringify(formData.size || []));
      } else {
        // ensure undefined/null become empty string to avoid "undefined" text
        payload.append(key, formData[key] !== undefined && formData[key] !== null ? formData[key] : "");
      }
    }

    // Append images (files) that user selected (images state)
    if (Array.isArray(images) && images.length > 0) {
      images.forEach((img) => {
        // img should be a File/Blob
        payload.append("images", img);
      });
    } else if (Array.isArray(selectedFiles) && selectedFiles.length > 0) {
      // fallback: if you used selectedFiles
      selectedFiles.forEach((img) => payload.append("images", img));
    } else {
      // No new files: send existing preview URLs so backend can keep them
      payload.append("existingImageUrls", JSON.stringify(previewImages || []));
    }

    // If editing, attach productId (backend / Redux expects this)
    if (isEditing && formData && formData._id) {
      payload.append("productId", formData._id);
    }

    // Dispatch update or create just like your simple code
    if (isEditing) {
      // update path — reducer / action expects FormData
      await dispatch(updateProduct(payload));
      setSuccess(true);
      setSuccessMessage("Product updated successfully.");
      // navigate back or keep on page as desired
      // navigate("/admin/products");
    } else {
      // create path — follow your simple code calling createProduct with { data, jwt }
      const jwt = localStorage.getItem("jwt");

await dispatch(createProduct(payload, jwt));
      // clear form after successful creation (same fields you used earlier)
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
      setSuccess(true);
      setSuccessMessage("Product created successfully.");
    }
  } catch (err) {
    console.error("Update/create failed:", err);
    setSuccess(false);
    setSuccessMessage(err?.message || "Operation failed. See console.");
  }
};





// ... (rest of the component)


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
      const url = `${base}/api/admin/products/${encodeURIComponent(third)}`;
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


      // calculate percentage
      // --- auto-calc discount percent when price or discountedPrice change ---
useEffect(() => {
  const p = Number(formData.price);
  const dp = Number(formData.discountedPrice);

  // Only calculate when both are valid finite numbers and price > 0
  if (Number.isFinite(p) && Number.isFinite(dp) && p > 0) {
    // Ensure discounted price is not greater than original price
    const safeDp = Math.min(dp, p);
    const percent = Math.round(((p - safeDp) / p) * 100);
    // Only update if the value actually differs to avoid unnecessary state updates
    if (String(formData.discountPercentage) !== String(percent)) {
      setFormData((prev) => ({ ...prev, discountPercentage: percent }));
    }
  } else {
    // If inputs are invalid/empty, clear the discountPercentage (keep empty string)
    if (formData.discountPercentage !== "") {
      setFormData((prev) => ({ ...prev, discountPercentage: "" }));
    }
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [formData.price, formData.discountedPrice]);


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
  <div className="mb-6 bg-white shadow-md rounded-lg p-5 border border-gray-200">
    <h3 className="mb-4 text-gray-900 font-semibold text-lg">
      Available Sizes (Set Quantities)
    </h3>

    <div className="grid grid-cols-2 gap-4">
      {sizeChart.sizes.map((sizeObj) => {
        const label = sizeObj.label;

        const current =
          formData.size?.find((s) => s.name === label) || {
            name: label,
            quantity: 0,
          };

        return (
          <div
            key={label}
            className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-md px-4 py-2"
          >
            <span className="text-gray-900 font-medium">{label}</span>

            <input
              type="number"
              min="0"
              value={current.quantity}
              onChange={(e) => {
                const q = Number(e.target.value || 0);
                setFormData((prev) => {
                  const sizes = Array.isArray(prev.size) ? [...prev.size] : [];
                  const idx = sizes.findIndex((s) => s.name === label);

                  if (idx >= 0) {
                    sizes[idx] = { ...sizes[idx], quantity: q };
                  } else {
                    sizes.push({ name: label, quantity: q });
                  }

                  return { ...prev, size: sizes };
                });
              }}
              className="w-24 border border-gray-300 rounded-md px-2 py-1 text-gray-900 bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
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