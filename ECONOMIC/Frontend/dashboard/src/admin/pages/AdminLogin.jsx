import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";

const ADMIN_TOKEN_KEY = "adminToken";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setStatus({ loading: true, error: "" });

      const data = await apiRequest("/admin/login", {
        method: "POST",
        body: { email, password }
      });

      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div style={{ width: "320px", margin: "100px auto" }}>
      <h2>Admin Login</h2>

      {status.error && <div className="alert alert-danger">{status.error}</div>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={status.loading}
        >
          {status.loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
