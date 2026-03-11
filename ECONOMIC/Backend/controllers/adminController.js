const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "insecure_dev_secret";
const TOKEN_TTL = "1d";

const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });

const comparePassword = async (plain, stored) => {
  if (!stored) return false;
  if (stored.startsWith("$2")) {
    return bcrypt.compare(plain, stored);
  }
  return plain === stored;
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const adminResult = await pool.query(
      "SELECT id,email,password FROM admins WHERE email=$1",
      [normalizedEmail]
    );

    if (adminResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = adminResult.rows[0];
    const passwordMatches = await comparePassword(password, admin.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: admin.id, role: "admin" });

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (err) {
    console.error("Admin login failed", err);
    res.status(500).json({ message: "Unable to login" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, price, description } = req.body;

  const parsedPrice = Number(price);

  if (!name || Number.isNaN(parsedPrice)) {
    return res.status(400).json({ message: "Name and valid price are required" });
  }

  try {
    const product = await pool.query(
      "INSERT INTO products(name,price,description) VALUES($1,$2,$3) RETURNING *",
      [name, parsedPrice, description || ""]
    );

    res.status(201).json(product.rows[0]);
  } catch (err) {
    console.error("Add product failed", err);
    res.status(500).json({ message: "Unable to add product" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  const parsedPrice = Number(price);

  if (!id || !name || Number.isNaN(parsedPrice)) {
    return res
      .status(400)
      .json({ message: "Product id, name, and valid price are required" });
  }

  try {
    const updated = await pool.query(
      "UPDATE products SET name=$1,price=$2,description=$3 WHERE id=$4 RETURNING *",
      [name, parsedPrice, description || "", id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated.rows[0]);
  } catch (err) {
    console.error("Update product failed", err);
    res.status(500).json({ message: "Unable to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Product id is required" });
  }

  try {
    const deleted = await pool.query(
      "DELETE FROM products WHERE id=$1 RETURNING id",
      [id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product failed", err);
    res.status(500).json({ message: "Unable to delete product" });
  }
};
