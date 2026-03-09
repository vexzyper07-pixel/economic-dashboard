 const express = require("express");
const cors = require("cors");

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

// start server
app.listen(5000, () => {
 console.log("Server running on port 5000");
});