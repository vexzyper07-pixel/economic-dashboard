import "./App.css";
import {
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Signin from "./pages/Signin";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AddProduct from "./admin/pages/AddProduct";
import ManageProducts from "./admin/pages/ManageProducts";
import AdminLogout from "./admin/pages/AdminLogout";
import { useAuth } from "./context/AuthContext";
import { authorizedRequest } from "./services/api";

function App() {
  const [cart, setCart] = useState([]);
  const [cartError, setCartError] = useState("");
  const [loadingCart, setLoadingCart] = useState(false);
  const { token, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart([]);
      return;
    }

    setLoadingCart(true);
    setCartError("");

    try {
      const data = await authorizedRequest(token, "/cart");
      setCart(data);
    } catch (error) {
      setCartError(error.message);
      if (error.message.toLowerCase().includes("token")) {
        logout();
      }
    } finally {
      setLoadingCart(false);
    }
  }, [logout, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isAuthenticated) {
        navigate("/signin");
        return;
      }

      try {
        const newItem = await authorizedRequest(token, "/cart", {
          method: "POST",
          body: { productId, quantity }
        });

        setCart((prev) => {
          const exists = prev.some((item) => item.id === newItem.id);
          if (exists) {
            return prev.map((item) =>
              item.id === newItem.id ? newItem : item
            );
          }
          return [newItem, ...prev];
        });
      } catch (error) {
        alert(error.message);
      }
    },
    [isAuthenticated, navigate, token]
  );

  const updateCartQuantity = useCallback(
    async (cartId, quantity) => {
      if (!token) return;

      try {
        const updated = await authorizedRequest(token, `/cart/${cartId}`, {
          method: "PATCH",
          body: { quantity }
        });

        setCart((prev) =>
          prev.map((item) => (item.id === cartId ? updated : item))
        );
      } catch (error) {
        alert(error.message);
      }
    },
    [token]
  );

  const removeCartItem = useCallback(
    async (cartId) => {
      if (!token) return;

      try {
        await authorizedRequest(token, `/cart/${cartId}`, {
          method: "DELETE"
        });

        setCart((prev) => prev.filter((item) => item.id !== cartId));
      } catch (error) {
        alert(error.message);
      }
    },
    [token]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      {!isAdminRoute && (
        <Navbar cartCount={cartCount} cartError={cartError} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/products"
          element={<Products addToCart={addToCart} />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetails addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              isAuthenticated={isAuthenticated}
              loading={loadingCart}
              onQuantityChange={updateCartQuantity}
              onRemoveItem={removeCartItem}
            />
          }
        />
        <Route
          path="/payment"
          element={
            <Payment
              cart={cart}
              isAuthenticated={isAuthenticated}
              refreshCart={fetchCart}
            />
          }
        />
        <Route path="/signin" element={<Signin />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/manage-products" element={<ManageProducts />} />
        <Route path="/admin/logout" element={<AdminLogout />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
