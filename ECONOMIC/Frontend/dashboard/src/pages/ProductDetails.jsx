import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(Number(amount || 0));

const fallbackImage =
  "https://via.placeholder.com/500x350.png?text=Product+Image";

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const data = await apiRequest(`/products/${id}`);
        if (isMounted) {
          setProduct(data);
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

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image || fallbackImage}
            className="img-fluid rounded"
            alt={product.name}
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="lead">{product.description}</p>
          <h4>{formatCurrency(product.price)}</h4>
          <button
            className="btn btn-success mt-3"
            onClick={() => addToCart(product.id)}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
