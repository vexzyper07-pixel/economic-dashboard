const pool = require("../config/db");

exports.getProducts = async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );
    res.json(products.rows);
  } catch (err) {
    console.error("Fetch products failed", err);
    res.status(500).json({ message: "Unable to fetch products" });
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product.rows[0]);
  } catch (err) {
    console.error("Fetch product failed", err);
    res.status(500).json({ message: "Unable to fetch product" });
  }
};
