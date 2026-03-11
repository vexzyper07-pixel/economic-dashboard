const pool = require("../config/db");

exports.checkout = async (req, res) => {

  const { user_id } = req.body;

  const cart = await pool.query(
    "SELECT * FROM cart WHERE user_id=$1",
    [user_id]
  );

  if (cart.rows.length === 0)
    return res.json("Cart empty");

  let total = 0;

  for (let item of cart.rows) {

    const product = await pool.query(
      "SELECT price FROM products WHERE id=$1",
      [item.product_id]
    );

    total += product.rows[0].price * item.quantity;
  }

  const order = await pool.query(
    "INSERT INTO orders(user_id,total,status) VALUES($1,$2,$3) RETURNING *",
    [user_id, total, "paid"]
  );

  await pool.query("DELETE FROM cart WHERE user_id=$1", [user_id]);

  res.json(order.rows[0]);
};