import { Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";

function AdminRoutes() {
  return (
    <Routes>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-product" element={<AddProduct />} />
      <Route path="/admin/manage-products" element={<ManageProducts />} />

    </Routes>
  );
}

export default AdminRoutes;