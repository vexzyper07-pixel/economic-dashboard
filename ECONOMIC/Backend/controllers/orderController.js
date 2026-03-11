const pool = require("../config/db");

exports.getOrders = async (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Admin cannot view orders" });
  }

  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id=$1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(orders.rows);
  } catch (err) {
    console.error("Fetch orders failed", err);
    res.status(500).json({ message: "Unable to fetch orders" });
  }
};

exports.checkout = async (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Admin cannot place orders" });
  }

  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const cart = await client.query(
      `
        SELECT c.product_id,
               c.quantity,
               p.price,
               p.name
        FROM cart c
        JOIN products p ON p.id = c.product_id
        WHERE c.user_id=$1
      `,
      [req.user.id]
    );

    if (cart.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cart.rows.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const order = await client.query(
      "INSERT INTO orders(user_id,total,status) VALUES($1,$2,$3) RETURNING *",
      [req.user.id, total, "paid"]
    );

    await client.query("DELETE FROM cart WHERE user_id=$1", [req.user.id]);
    await client.query("COMMIT");

    res.status(201).json({
      order: order.rows[0],
      total,
      items: cart.rows
    });
  } catch (err) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Checkout failed", err);
    res.status(500).json({ message: "Unable to complete checkout" });
  } finally {
    if (client) {
      client.release();
    }
  }
};
