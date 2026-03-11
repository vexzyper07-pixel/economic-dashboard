import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(Number(amount || 0));

const fallbackImage =
  "https://via.placeholder.com/400x250.png?text=Product+Image";

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const data = await apiRequest("/products");
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Products</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card mb-4 h-100">
              <img
                src={product.image || fallbackImage}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body text-center d-flex flex-column">
                <h5>{product.name}</h5>
                <p>{formatCurrency(product.price)}</p>
                <div className="mt-auto">
                  <Link
                    to={`/product/${product.id}`}
                    className="btn btn-secondary me-2"
                  >
                    View Details
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product.id)}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-12 text-center">
            <p>No products available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
