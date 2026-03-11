import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

function Signin() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setStatus({ loading: false, error: "" });
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setStatus({ loading: false, error: "Email and password are required" });
      return;
    }

    try {
      setStatus({ loading: true, error: "" });

      const data = await apiRequest(
        mode === "login" ? "/auth/login" : "/auth/signup",
        {
          method: "POST",
          body: { email, password }
        }
      );

      login({ user: data.user, token: data.token });
      navigate("/");
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between mb-3">
              <button
                type="button"
                className={`btn ${mode === "login" ? "btn-primary" : "btn-light"}`}
                onClick={() => setMode("login")}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`btn ${mode === "signup" ? "btn-primary" : "btn-light"}`}
                onClick={() => setMode("signup")}
              >
                Create Account
              </button>
            </div>

            {status.error && (
              <div className="alert alert-danger">{status.error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-3"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="form-control mb-3"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={status.loading}
              >
                {status.loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
