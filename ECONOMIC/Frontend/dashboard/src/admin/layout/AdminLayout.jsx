import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const ADMIN_TOKEN_KEY = "adminToken";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      navigate("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <AdminNavbar />
        <div className="admin-content-body">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
