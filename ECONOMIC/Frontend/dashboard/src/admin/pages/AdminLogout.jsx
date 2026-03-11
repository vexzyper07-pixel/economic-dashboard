import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_TOKEN_KEY = "adminToken";

function AdminLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate("/admin/login");
  }, [navigate]);

  return (
    <div className="container mt-5 text-center">
      <p>Signing you out...</p>
    </div>
  );
}

export default AdminLogout;
