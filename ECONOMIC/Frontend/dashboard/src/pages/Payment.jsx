 import React, { useState } from "react";

function Payment() {

  const [method, setMethod] = useState("");

  const [upi, setUpi] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [pin, setPin] = useState("");

  const handlePayment = async (e) => {

    e.preventDefault();

    //  No payment method selected
    if (!method) {
      alert("Please select a payment method");
      return;
    }

    // UPI validation
    if (method === "upi" && upi.trim() === "") {
      alert("Please enter UPI ID");
      return;
    }

    //  Credit card validation
    if (method === "credit") {
      if (cardNumber === "" || expiry === "" || cvv === "") {
        alert("Please fill all credit card details");
        return;
      }
    }

    // Debit card validation
    if (method === "debit") {
      if (cardNumber === "" || pin === "") {
        alert("Please fill all debit card details");
        return;
      }
    }

    try {

      const response = await fetch("http://localhost:5000/api/cart/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (data.success) {
        alert("Payment Done ✅");
      } else {
        alert("Payment Failed");
      }

    } catch (error) {

      console.error(error);
      alert("Server Error");

    }
  };

  return (

    <div className="container mt-5">

      <h2>Payment</h2>

      {/* Payment Options */}

      <div className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="payment"
          value="upi"
          onChange={(e) => setMethod(e.target.value)}
        />
        <label className="form-check-label">UPI</label>
      </div>

      <div className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="payment"
          value="credit"
          onChange={(e) => setMethod(e.target.value)}
        />
        <label className="form-check-label">Credit Card</label>
      </div>

      <div className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="payment"
          value="debit"
          onChange={(e) => setMethod(e.target.value)}
        />
        <label className="form-check-label">Debit Card</label>
      </div>

      <br />

      {/* UPI FORM */}

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

      {/* CREDIT CARD FORM */}

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

      {/* DEBIT CARD FORM */}

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

      <br />

      <button
        className="btn btn-primary"
        onClick={handlePayment}
      >
        Pay Now
      </button>

    </div>

  );
}

export default Payment;