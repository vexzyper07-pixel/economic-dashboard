 const pool = require("../config/db"); // PostgreSQL connection


// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
 try {

  const { username, email, password } = req.body;

  // validation
  if (!username || !email || !password) {
   return res.status(400).json({
    message: "All fields are required"
   });
  }

  // check if user exists
  const existingUser = await pool.query(
   "SELECT * FROM users WHERE email=$1",
   [email]
  );

  if (existingUser.rows.length > 0) {
   return res.status(409).json({
    message: "Email already registered"
   });
  }

  // insert user
  const result = await pool.query(
   "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING id,username,email",
   [username, email, password]
  );

  res.status(201).json({
   message: "Signup successful",
   user: result.rows[0]
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }
};



// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {

 try {

  const { email, password } = req.body;

  if (!email || !password) {
   return res.status(400).json({
    message: "Email and password required"
   });
  }

  const result = await pool.query(
   "SELECT * FROM users WHERE email=$1",
   [email]
  );

  if (result.rows.length === 0) {
   return res.status(401).json({
    message: "User not found"
   });
  }

  const user = result.rows[0];

  if (user.password !== password) {
   return res.status(401).json({
    message: "Invalid password"
   });
  }

  res.json({
   message: "Login successful",
   user: {
    id: user.id,
    username: user.username,
    email: user.email
   }
  });

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }

};



// ======================
// CREATE PRODUCT WITH IMAGE
// ======================
exports.createProduct = async (req, res) => {

 try {

  const { name, price, description } = req.body;

  // image URL
  const image = `http://localhost:5000/uploads/${req.file.filename}`;

  const result = await pool.query(
   "INSERT INTO products (name, price, description, image) VALUES ($1,$2,$3,$4) RETURNING *",
   [name, price, description, image]
  );

  res.status(201).json(result.rows[0]);

 } catch (error) {

  console.error(error);

  res.status(500).json({
   message: "Server error"
  });

 }

};