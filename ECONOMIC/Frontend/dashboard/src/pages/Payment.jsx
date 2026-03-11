import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authorizedRequest } from "../services/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(Number(amount || 0));

function Payment({ cart, isAuthenticated, refreshCart }) {
  const [method, setMethod] = useState("");
  const [upi, setUpi] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [pin, setPin] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useAuth();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">
          Please{" "}
          <Link to="/signin" className="alert-link">
            sign in
          </Link>{" "}
          before completing the payment.
        </div>
      </div>
    );
  }

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

  const validateFields = () => {
    if (!method) {
      setError("Please select a payment method");
      return false;
    }

    if (method === "upi" && !upi.trim()) {
      setError("Please enter a UPI ID");
      return false;
    }

    if (method === "credit") {
      if (!cardNumber || !expiry || !cvv) {
        setError("Please fill in all credit card details");
        return false;
      }
    }

    if (method === "debit") {
      if (!cardNumber || !pin) {
        setError("Please fill in all debit card details");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      setProcessing(true);
      await authorizedRequest(token, "/orders/checkout", {
        method: "POST",
        body: { paymentMethod: method }
      });

      await refreshCart();
      alert("Payment successful! Order placed.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Payment</h2>
      <p className="text-muted">Payable amount: {formatCurrency(total)}</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handlePayment}>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="payment"
            value="upi"
            id="upiOption"
            onChange={(e) => setMethod(e.target.value)}
          />
          <label className="form-check-label" htmlFor="upiOption">
            UPI
          </label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="payment"
            value="credit"
            id="creditOption"
            onChange={(e) => setMethod(e.target.value)}
          />
          <label className="form-check-label" htmlFor="creditOption">
            Credit Card
          </label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="payment"
            value="debit"
            id="debitOption"
            onChange={(e) => setMethod(e.target.value)}
          />
          <label className="form-check-label" htmlFor="debitOption">
            Debit Card
          </label>
        </div>

        {method === "upi" && (
          <div className="card p-3 mt-3">
            <h5>UPI Payment</h5>
            <input
              type="text"
              className="form-control"
              placeholder="Enter UPI ID"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
          </div>
        )}

        {method === "credit" && (
          <div className="card p-3 mt-3">
            <h5>Credit Card Details</h5>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Expiry Date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        )}

        {method === "debit" && (
          <div className="card p-3 mt-3">
            <h5>Debit Card Details</h5>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={processing}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

export default Payment;
