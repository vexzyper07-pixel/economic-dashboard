 const pool = require("../config/db");

exports.addProduct = async (req, res) => {

  const { name, price, description } = req.body;

  const product = await pool.query(
    "INSERT INTO products(name,price,description) VALUES($1,$2,$3) RETURNING *",
    [name, price, description]
  );

  res.json(product.rows[0]);
};

exports.updateProduct = async (req, res) => {

  const { id } = req.params;
  const { name, price, description } = req.body;

  await pool.query(
    "UPDATE products SET name=$1,price=$2,description=$3 WHERE id=$4",
    [name, price, description, id]
  );

  res.json("Product updated");
};

exports.deleteProduct = async (req, res) => {

  const { id } = req.params;

  await pool.query("DELETE FROM products WHERE id=$1", [id]);

  res.json("Product deleted");
};

exports.getUsers = async (req, res) => {

  const users = await pool.query("SELECT id,name,email FROM users");

  res.json(users.rows);
};