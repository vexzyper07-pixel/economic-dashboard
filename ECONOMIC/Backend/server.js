 const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // PostgreSQL connection

// routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// allow uploaded images access
app.use("/uploads", express.static("uploads"));

// test route
app.get("/", (req, res) => {
 res.send("API is working");
});

// authentication routes
app.use("/api", authRoutes);

// product routes
app.use("/api", productRoutes);

app.get("/api/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});


// 👉 ADD PAYMENT API HERE
app.post("/api/cart/payment", async (req, res) => {

  try {

    await pool.query(
      "UPDATE cart SET action='done' WHERE action='pending'"
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false
    });

  }

});

const cartRoutes = require("./routes/cart");

app.use("/api/cart", cartRoutes);

// start server
app.listen(5000, () => {
 console.log("Server running on port 5000");
});