import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ cartCount, cartError }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Economic Dashboard
        </Link>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/products">
              Products
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/cart">
              Cart ({cartCount})
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <span className="nav-link text-success">
                  {user?.email}
                </span>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/signin">
                Sign In
              </Link>
            </li>
          )}

          <li className="nav-item ms-3">
            <Link className="nav-link fw-semibold" to="/admin/login">
              Admin Panel
            </Link>
          </li>
        </ul>
      </div>
      {cartError && (
        <div className="w-100 text-center text-warning small py-1">
          {cartError}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
