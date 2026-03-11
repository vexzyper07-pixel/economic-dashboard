import { Link } from "react-router-dom";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(Number(amount || 0));

function Cart({
  cart,
  isAuthenticated,
  loading,
  onQuantityChange,
  onRemoveItem
}) {
  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">
          Please{" "}
          <Link to="/signin" className="alert-link">
            sign in
          </Link>{" "}
          to view your cart.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>Your cart is empty.</h3>
        <Link to="/products" className="btn btn-primary mt-3">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>

      <div className="table-responsive">
        <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{formatCurrency(item.price)}</td>
              <td>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() =>
                      onQuantityChange(item.id, Math.max(1, item.quantity - 1))
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  {item.quantity}
                  <button
                    className="btn btn-sm btn-secondary ms-2"
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td>{formatCurrency(item.price * item.quantity)}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onRemoveItem(item.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <h4>Total Amount: {formatCurrency(total)}</h4>
        <Link to="/payment" className="btn btn-success">
          Proceed To Payment
        </Link>
      </div>
    </div>
  );
}

export default Cart;
