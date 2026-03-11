import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { apiRequest } from "../../services/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(Number(amount || 0));

function AdminDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    inventoryValue: 0,
    loading: true
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const products = await apiRequest("/products");
        if (!isMounted) return;

        const inventoryValue = products.reduce(
          (sum, item) => sum + Number(item.price || 0),
          0
        );

        setStats({
          productCount: products.length,
          inventoryValue,
          loading: false
        });
      } catch {
        if (isMounted) {
          setStats((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminLayout>
      <h1 className="mb-4">Welcome, Admin</h1>

      {stats.loading ? (
        <p>Loading overview...</p>
      ) : (
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>Total Products</h5>
              <h2>{stats.productCount}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>Inventory Value</h5>
              <h2>{formatCurrency(stats.inventoryValue)}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h5>Actions</h5>
              <p className="text-muted">
                Use the sidebar to add or manage products. Admins cannot view
                customer orders.
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
