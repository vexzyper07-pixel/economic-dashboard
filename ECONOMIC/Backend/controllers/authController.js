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

const sanitizeUser = (userRow) => ({
  id: userRow.id,
  email: userRow.email,
  role: userRow.role
});

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    const normalizedEmail = email.toLowerCase();

    const userExists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [normalizedEmail]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users(email, password, role) VALUES($1,$2,$3) RETURNING id,email,role",
      [normalizedEmail, hashedPassword, "user"]
    );

    const user = newUser.rows[0];
    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Signup error", err);
    res.status(500).json({ message: "Unable to create account" });
  }
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

    const userResult = await pool.query(
      "SELECT id,email,password,role FROM users WHERE email=$1",
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const passwordMatches = await comparePassword(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Unable to login" });
  }
};
