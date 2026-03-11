const pool = require("../config/db");

exports.addToCart = async (req, res) => {

  const { user_id, product_id, quantity } = req.body;

  const cart = await pool.query(
    "INSERT INTO cart(user_id,product_id,quantity) VALUES($1,$2,$3) RETURNING *",
    [user_id, product_id, quantity]
  );

  res.json(cart.rows[0]);
};

exports.getCart = async (req, res) => {

  const { user_id } = req.params;

  const cart = await pool.query(
    "SELECT * FROM cart WHERE user_id=$1",
    [user_id]
  );

  res.json(cart.rows);
};

exports.removeCartItem = async (req, res) => {

  const { id } = req.params;

  await pool.query("DELETE FROM cart WHERE id=$1", [id]);

  res.json("Item removed");
};