 const pool = require("../config/db");

exports.getProducts = async (req, res) => {
  const products = await pool.query("SELECT * FROM products");
  res.json(products.rows);
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  const product = await pool.query(
    "SELECT * FROM products WHERE id=$1",
    [id]
  );

  res.json(product.rows[0]);
};