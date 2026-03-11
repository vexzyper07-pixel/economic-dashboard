const bcrypt = require("bcrypt");
const pool = require("../config/db");
require("dotenv").config();

const adminEmail =
  process.env.DEFAULT_ADMIN_EMAIL || "admin@gmail.com";
const adminPassword =
  process.env.DEFAULT_ADMIN_PASSWORD || "Admin1234";

const baseProducts = [
  {
    name: "Macroview Laptop 14\"",
    price: 62999,
    description: "A balanced ultrabook for productivity and travel."
  },
  {
    name: "Quantix Noise-Cancelling Headphones",
    price: 14999,
    description: "Wireless over-ear headphones with hybrid ANC."
  },
  {
    name: "Ledger Pro Mechanical Keyboard",
    price: 8999,
    description: "Hotswap keyboard with RGB and aluminum chassis."
  }
];

const run = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'user';
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(12,2) NOT NULL,
        description TEXT DEFAULT '',
        image TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      ALTER TABLE cart
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
    `);

    await pool.query(`
      ALTER TABLE cart
      ADD COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products(id) ON DELETE CASCADE;
    `);

    await pool.query(`
      ALTER TABLE cart
      ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;
    `);

    await pool.query(`
      ALTER TABLE cart
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total NUMERIC(12,2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'paid',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const adminExists = await pool.query(
      "SELECT id FROM admins WHERE email=$1",
      [adminEmail.toLowerCase()]
    );

    if (adminExists.rows.length === 0) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        "INSERT INTO admins(email,password) VALUES($1,$2)",
        [adminEmail.toLowerCase(), hashed]
      );
      console.log(
        `Seeded admin account ${adminEmail} / ${adminPassword}`
      );
    }

    const productCount = await pool.query("SELECT COUNT(*) FROM products");
    if (Number(productCount.rows[0].count) === 0) {
      for (const product of baseProducts) {
        await pool.query(
          "INSERT INTO products(name,price,description) VALUES($1,$2,$3)",
          [product.name, product.price, product.description]
        );
      }
      console.log("Inserted sample products");
    }

    console.log("Database ready.");
  } catch (err) {
    console.error("Database seed failed", err);
  } finally {
    await pool.end();
  }
};

run();
