import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { apiRequest, authorizedRequest } from "../../services/api";

const ADMIN_TOKEN_KEY = "adminToken";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "", description: "" });
  const [status, setStatus] = useState({ loading: false, error: "" });

  const loadProducts = async () => {
    setStatus({ loading: true, error: "" });
    try {
      const data = await apiRequest("/products");
      setProducts(data);
    } catch (err) {
      setStatus({ loading: false, error: err.message });
      return;
    }
    setStatus((prev) => ({ ...prev, loading: false }));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditData({
      name: product.name,
      price: product.price,
      description: product.description || ""
    });
  };

  const handleUpdate = async () => {
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!adminToken) {
      setStatus({ loading: false, error: "Admin session expired" });
      return;
    }

    try {
      await authorizedRequest(adminToken, `/admin/products/${editingId}`, {
        method: "PUT",
        body: {
          ...editData,
          price: Number(editData.price)
        }
      });
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  const handleDelete = async (id) => {
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!adminToken) {
      setStatus({ loading: false, error: "Admin session expired" });
      return;
    }

    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await authorizedRequest(adminToken, `/admin/products/${id}`, {
        method: "DELETE"
      });
      await loadProducts();
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <AdminLayout>
      <h2>Manage Products</h2>

      {status.error && <div className="alert alert-danger">{status.error}</div>}

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {editingId === product.id ? (
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="form-control"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, price: e.target.value }))
                      }
                      className="form-control"
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td>
                  {editingId === product.id ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                      className="form-control"
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td>
                  {editingId === product.id ? (
                    <button className="btn btn-success me-2" onClick={handleUpdate}>
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-primary me-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {status.loading && <p>Refreshing products...</p>}
    </AdminLayout>
  );
}

export default ManageProducts;
