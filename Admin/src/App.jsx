import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Customers from "./Pages/Customers";
import AdminAddProduct from "./Pages/AdminAddProduct";
import UpdateProduct from "./Pages/UpdateProduct";

const App = () => {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Admin layout wrapper */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/update-product" element={<UpdateProduct />} />
      </Route>
    </Routes>
  );
};

export default App;
