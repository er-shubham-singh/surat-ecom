import React from "react";
import AddProductForm from "../Common/AddProductForm";

const AdminAddProduct = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f1120] to-bg-[#15172b] p-8">
      <h1 className="text-center text-4xl font-semibold mb-6">Add New Product</h1>
      <AddProductForm />
    </div>
  );
};

export default AdminAddProduct;
