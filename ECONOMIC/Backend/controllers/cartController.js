const pool = require("../config/db");

const fetchCartItemWithProduct = async (cartId) => {
  const result = await pool.query(
    `
      SELECT c.id,
             c.product_id,
             c.quantity,
             p.name,
             p.price,
             p.description
      FROM cart c
      JOIN products p ON p.id = c.product_id
      WHERE c.id=$1
    `,
    [cartId]
  );

  return result.rows[0];
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await pool.query(
      `
        SELECT c.id,
               c.product_id,
               c.quantity,
               p.name,
               p.price,
               p.description
        FROM cart c
        JOIN products p ON p.id = c.product_id
        WHERE c.user_id=$1
        ORDER BY c.id DESC
      `,
      [userId]
    );

    res.json(cart.rows);
  } catch (err) {
    console.error("Fetch cart failed", err);
    res.status(500).json({ message: "Unable to fetch cart" });
  }
};

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, product_id, quantity } = req.body;
  const resolvedProductId = productId || product_id;
  const parsedQty = Number(quantity);
  const qty =
    Number.isInteger(parsedQty) && parsedQty > 0 ? parsedQty : 1;

  if (!resolvedProductId) {
    return res.status(400).json({ message: "Product id is required" });
  }

  try {
    const product = await pool.query(
      "SELECT id FROM products WHERE id=$1",
      [resolvedProductId]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existing = await pool.query(
      "SELECT id FROM cart WHERE user_id=$1 AND product_id=$2",
      [userId, resolvedProductId]
    );

    if (existing.rows.length > 0) {
      const updated = await pool.query(
        "UPDATE cart SET quantity = quantity + $1 WHERE id=$2 RETURNING id",
        [qty, existing.rows[0].id]
      );
      const cartItem = await fetchCartItemWithProduct(updated.rows[0].id);
      return res.json(cartItem);
    }

    const inserted = await pool.query(
      "INSERT INTO cart(user_id,product_id,quantity) VALUES($1,$2,$3) RETURNING id",
      [userId, resolvedProductId, qty]
    );

    const cartItem = await fetchCartItemWithProduct(inserted.rows[0].id);

    res.status(201).json(cartItem);
  } catch (err) {
    console.error("Add to cart failed", err);
    res.status(500).json({ message: "Unable to add product to cart" });
  }
};

exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;

  const qty = Number(quantity);

  if (!id || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ message: "Valid quantity is required" });
  }

  try {
    const updated = await pool.query(
      "UPDATE cart SET quantity=$1 WHERE id=$2 AND user_id=$3 RETURNING id",
      [qty, id, userId]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const cartItem = await fetchCartItemWithProduct(updated.rows[0].id);

    res.json(cartItem);
  } catch (err) {
    console.error("Update cart failed", err);
    res.status(500).json({ message: "Unable to update cart item" });
  }
};

exports.removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Cart item id is required" });
  }

  try {
    const deleted = await pool.query(
      "DELETE FROM cart WHERE id=$1 AND user_id=$2 RETURNING id",
      [id, userId]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Remove cart failed", err);
    res.status(500).json({ message: "Unable to remove cart item" });
  }
};
