import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { authorizedRequest } from "../../services/api";

const ADMIN_TOKEN_KEY = "adminToken";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: ""
  });
  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!adminToken) {
      setStatus({ loading: false, message: "Admin session expired" });
      return;
    }

    try {
      setStatus({ loading: true, message: "" });

      await authorizedRequest(adminToken, "/admin/products", {
        method: "POST",
        body: {
          ...product,
          price: Number(product.price)
        }
      });

      setStatus({ loading: false, message: "Product added successfully" });
      setProduct({ name: "", price: "", description: "" });
    } catch (err) {
      setStatus({ loading: false, message: err.message });
    }
  };

  return (
    <AdminLayout>
      <div
        style={{
          maxWidth: "500px",
          margin: "40px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          background: "#f9f9f9"
        }}
      >
        <h2 style={{ textAlign: "center" }}>Product Details</h2>

        {status.message && (
          <div className="alert alert-info mt-3">{status.message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              style={{ width: "100%", padding: "8px" }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter price"
              style={{ width: "100%", padding: "8px" }}
              min="1"
              required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
              style={{ width: "100%", padding: "8px" }}
              rows={3}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
            disabled={status.loading}
          >
            {status.loading ? "Saving..." : "Add Product"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddProduct;
